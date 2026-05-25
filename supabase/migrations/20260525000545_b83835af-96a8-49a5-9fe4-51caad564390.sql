
-- =========================================
-- ROLES
-- =========================================
create type public.app_role as enum ('admin', 'customer');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users view own roles" on public.user_roles
  for select to authenticated using (user_id = auth.uid());
create policy "Admins view all roles" on public.user_roles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage roles" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- PROFILES
-- =========================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles: select own" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "Profiles: insert own" on public.profiles
  for insert to authenticated with check (id = auth.uid());
create policy "Profiles: update own" on public.profiles
  for update to authenticated using (id = auth.uid());
create policy "Profiles: admins read all" on public.profiles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================
-- CATEGORIES
-- =========================================
create table public.categories (
  slug text primary key,
  name text not null,
  tagline text not null,
  blurb text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Categories: public read" on public.categories
  for select to anon, authenticated using (true);
create policy "Categories: admin write" on public.categories
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- PRODUCTS
-- =========================================
create table public.products (
  id text primary key,
  name text not null,
  price_naira numeric(10,2) not null check (price_naira >= 0),
  unit text not null,
  category_slug text not null references public.categories(slug) on delete restrict,
  origin text not null,
  description text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_idx on public.products(category_slug);
create index products_active_idx on public.products(is_active);

alter table public.products enable row level security;

create policy "Products: public read" on public.products
  for select to anon, authenticated using (is_active = true);
create policy "Products: admin read all" on public.products
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Products: admin write" on public.products
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- ORDERS
-- =========================================
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  fulfillment text not null check (fulfillment in ('delivery','pickup')),
  full_name text,
  phone text,
  address text,
  area text,
  landmark text,
  subtotal_naira numeric(12,2) not null,
  delivery_fee_naira numeric(12,2) not null default 0,
  total_naira numeric(12,2) not null,
  status text not null default 'placed' check (status in ('placed','confirmed','shipped','delivered','cancelled')),
  created_at timestamptz not null default now()
);

create index orders_user_idx on public.orders(user_id);
create index orders_created_idx on public.orders(created_at desc);

alter table public.orders enable row level security;

create policy "Orders: anyone can insert" on public.orders
  for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());
create policy "Orders: user reads own" on public.orders
  for select to authenticated using (user_id = auth.uid());
create policy "Orders: admin reads all" on public.orders
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Orders: admin updates" on public.orders
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- ORDER ITEMS
-- =========================================
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id) on delete restrict,
  product_name text not null,
  qty int not null check (qty > 0),
  unit_price_naira numeric(10,2) not null
);

create index order_items_order_idx on public.order_items(order_id);

alter table public.order_items enable row level security;

create policy "Order items: insert with matching order" on public.order_items
  for insert to anon, authenticated
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id is null or o.user_id = auth.uid())
    )
  );
create policy "Order items: user reads own" on public.order_items
  for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );
create policy "Order items: admin reads all" on public.order_items
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- VERIFICATIONS
-- =========================================
create table public.verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  nafdac text not null,
  batch text,
  result text not null check (result in ('verified','not_found')),
  created_at timestamptz not null default now()
);

create index verifications_user_idx on public.verifications(user_id);
create index verifications_nafdac_idx on public.verifications(nafdac);

alter table public.verifications enable row level security;

create policy "Verifications: anyone inserts" on public.verifications
  for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());
create policy "Verifications: user reads own" on public.verifications
  for select to authenticated using (user_id = auth.uid());
create policy "Verifications: admin reads all" on public.verifications
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- SUPPORT TICKETS
-- =========================================
create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  contact text not null,
  category text not null,
  order_ref text,
  message text not null,
  status text not null default 'open' check (status in ('open','in_progress','closed')),
  created_at timestamptz not null default now()
);

create index support_user_idx on public.support_tickets(user_id);

alter table public.support_tickets enable row level security;

create policy "Tickets: anyone inserts" on public.support_tickets
  for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());
create policy "Tickets: user reads own" on public.support_tickets
  for select to authenticated using (user_id = auth.uid());
create policy "Tickets: admin reads all" on public.support_tickets
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Tickets: admin updates" on public.support_tickets
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
