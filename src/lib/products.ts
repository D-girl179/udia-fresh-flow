import { supabase } from "@/integrations/supabase/client";
import ugu from "@/assets/ugu.jpg";
import yam from "@/assets/yam.jpg";
import plantain from "@/assets/plantain.jpg";
import palmoil from "@/assets/palmoil.jpg";
import crayfish from "@/assets/crayfish.jpg";
import peppers from "@/assets/peppers.jpg";
import garri from "@/assets/garri.jpg";
import banana from "@/assets/banana.jpg";

export type CategorySlug =
  | "pantry-staples"
  | "liquids-oils"
  | "fresh-produce"
  | "tubers-roots"
  | "proteins"
  | "spices-seasonings";

export type Category = {
  slug: CategorySlug;
  name: string;
  tagline: string;
  image: string;
  blurb: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: CategorySlug;
  origin: string;
  description: string;
};

// Bundled photography per category (DB stores no image URLs — we map locally).
const categoryHero: Record<CategorySlug, string> = {
  "pantry-staples": garri,
  "liquids-oils": palmoil,
  "fresh-produce": ugu,
  "tubers-roots": yam,
  proteins: crayfish,
  "spices-seasonings": peppers,
};

const imgs: Record<CategorySlug, string[]> = {
  "pantry-staples": [garri, yam, banana, palmoil],
  "liquids-oils": [palmoil, garri, crayfish, peppers],
  "fresh-produce": [ugu, plantain, peppers, banana],
  "tubers-roots": [yam, plantain, banana, ugu],
  proteins: [crayfish, peppers, palmoil, garri],
  "spices-seasonings": [peppers, crayfish, garri, palmoil],
};

function pickImage(category: CategorySlug, id: string): string {
  const pool = imgs[category] ?? [garri];
  // Stable hash from id → image index
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return pool[h % pool.length];
}

type ProductRow = {
  id: string;
  name: string;
  price_naira: number | string;
  unit: string;
  category_slug: CategorySlug;
  origin: string;
  description: string;
};

function toProduct(r: ProductRow): Product {
  return {
    id: r.id,
    name: r.name,
    price: Number(r.price_naira),
    unit: r.unit,
    category: r.category_slug,
    origin: r.origin,
    description: r.description,
    image: pickImage(r.category_slug, r.id),
  };
}

type CategoryRow = {
  slug: CategorySlug;
  name: string;
  tagline: string;
  blurb: string;
};

function toCategory(r: CategoryRow): Category {
  return {
    slug: r.slug,
    name: r.name,
    tagline: r.tagline,
    blurb: r.blurb,
    image: categoryHero[r.slug] ?? garri,
  };
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("slug,name,tagline,blurb,sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => toCategory(r as unknown as CategoryRow));
}

export async function fetchCategory(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("slug,name,tagline,blurb")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? toCategory(data as unknown as CategoryRow) : null;
}

export async function fetchProductsByCategory(slug: CategorySlug): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id,name,price_naira,unit,category_slug,origin,description")
    .eq("category_slug", slug)
    .order("name");
  if (error) throw error;
  return (data ?? []).map((r) => toProduct(r as unknown as ProductRow));
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("id,name,price_naira,unit,category_slug,origin,description")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toProduct(data as unknown as ProductRow) : null;
}

export async function fetchSimilar(id: string, limit = 4): Promise<Product[]> {
  const p = await fetchProduct(id);
  if (!p) return [];
  const { data, error } = await supabase
    .from("products")
    .select("id,name,price_naira,unit,category_slug,origin,description")
    .eq("category_slug", p.category)
    .neq("id", id)
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((r) => toProduct(r as unknown as ProductRow));
}

export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from("products")
    .select("id,name,price_naira,unit,category_slug,origin,description")
    .in("id", ids);
  if (error) throw error;
  return (data ?? []).map((r) => toProduct(r as unknown as ProductRow));
}

export const formatNaira = (n: number) =>
  "₦" + n.toLocaleString("en-NG", { maximumFractionDigits: 0 });

const categoryLabels: Record<CategorySlug, string> = {
  "pantry-staples": "Pantry Staples",
  "liquids-oils": "Liquids & Oils",
  "fresh-produce": "Fresh Produce",
  "tubers-roots": "Tubers & Roots",
  proteins: "Proteins",
  "spices-seasonings": "Spices & Seasonings",
};
export const categoryName = (slug: CategorySlug) => categoryLabels[slug] ?? slug;
