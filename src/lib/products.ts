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

/**
 * Build a deterministic, keyword-targeted square image URL.
 * Uses loremflickr (themed Flickr photos) which honours comma-separated
 * keywords and a `lock` seed for stable per-product visuals — every
 * product gets its own distinct image, never a generic placeholder.
 */
function img(keywords: string, seed: string, w = 800, h = 800) {
  const kw = encodeURIComponent(keywords.trim());
  const lock = Math.abs(
    [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7),
  );
  return `https://loremflickr.com/${w}/${h}/${kw}?lock=${lock}`;
}

export const categories: Category[] = [
  {
    slug: "pantry-staples",
    name: "Pantry Staples",
    tagline: "Garri, beans, flours & dry goods",
    image: img("garri,african,grains,sack", "cat-pantry", 900, 1100),
    blurb:
      "Stone-free grains, flours and legumes — the quiet foundation of every Nigerian kitchen.",
  },
  {
    slug: "liquids-oils",
    name: "Liquids & Oils",
    tagline: "Cold-pressed oils & local drinks",
    image: img("red,palm,oil,bottle", "cat-oils", 900, 1100),
    blurb:
      "Unrefined oils pressed within 48 hours, plus traditional drinks bottled by hand.",
  },
  {
    slug: "fresh-produce",
    name: "Fresh Produce",
    tagline: "Leaves, vegetables, picked at dawn",
    image: img("african,leafy,greens,vegetables", "cat-produce", 900, 1100),
    blurb:
      "Indigenous leaves and vegetables harvested the morning your order ships.",
  },
  {
    slug: "tubers-roots",
    name: "Tubers & Roots",
    tagline: "Yam, cocoyam, cassava, ginger",
    image: img("yam,tuber,african,market", "cat-tubers", 900, 1100),
    blurb:
      "Dense, earth-fresh tubers and roots from Benue, Cross River and beyond.",
  },
  {
    slug: "proteins",
    name: "Proteins",
    tagline: "Smoked fish, meats, seafood",
    image: img("smoked,fish,african,market", "cat-protein", 900, 1100),
    blurb:
      "Wood-smoked seafood, free-range meats and coastal catches — the heart of any soup.",
  },
  {
    slug: "spices-seasonings",
    name: "Spices & Seasonings",
    tagline: "Peppers, iru, uda, ehuru",
    image: img("african,spices,peppers,market", "cat-spice", 900, 1100),
    blurb:
      "Fire, funk and fragrance — the indigenous spices that define our cooking.",
  },
];

export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);

type Seed = {
  name: string;
  price: number;
  unit: string;
  origin: string;
  desc: string;
  q: string; // image search keywords
};

const seeds: Record<CategorySlug, Seed[]> = {
  "pantry-staples": [
    { name: "Ijebu Garri (White)", price: 2200, unit: "1kg", origin: "Ogoja mills", desc: "Stone-free, finely sifted Ijebu garri. Soak with cold water, groundnuts and sugar.", q: "white,garri,cassava,flour" },
    { name: "Yellow Garri", price: 2400, unit: "1kg", origin: "Ogoja mills", desc: "Palm-oil tinted garri, bold flavour — perfect for eba with okra or egusi.", q: "yellow,garri,cassava" },
    { name: "Egusi Seed (First Grade)", price: 4800, unit: "500g", origin: "Benue heartland", desc: "First-grade melon seed, hand-sorted and shell-free. Grind for soup or pudding.", q: "melon,seeds,egusi" },
    { name: "Ofada Rice", price: 5400, unit: "2kg", origin: "Ogun farms", desc: "Stone-picked local brown Ofada with its signature aroma. Pairs with ayamase stew.", q: "brown,rice,ofada,grains" },
    { name: "Honey Beans (Oloyin)", price: 4200, unit: "2kg", origin: "Kogi farms", desc: "Naturally sweet brown beans — cooks fast, no soaking required.", q: "brown,beans,legumes" },
    { name: "Drum Brown Beans", price: 3800, unit: "2kg", origin: "Sokoto silos", desc: "Classic brown beans for porridge, moimoi and akara.", q: "black,eyed,beans,sack" },
    { name: "Yam Flour (Elubo)", price: 3600, unit: "1kg", origin: "Kwara mills", desc: "Sun-dried, finely milled yam flour for amala. Smooth, lump-free swallow.", q: "yam,flour,brown" },
    { name: "Plantain Flour", price: 4100, unit: "1kg", origin: "Ondo collective", desc: "Unripe plantain flour for diabetic-friendly amala or pancakes.", q: "plantain,flour" },
    { name: "Cassava Flour (Lafun)", price: 2900, unit: "1kg", origin: "Oyo mills", desc: "Fermented cassava flour — the soul of white amala.", q: "cassava,flour,white" },
    { name: "Tuwo Corn Flour", price: 2700, unit: "1kg", origin: "Kaduna mills", desc: "Smoothly milled corn flour for tuwo shinkafa or masa.", q: "corn,flour,yellow" },
    { name: "Semolina", price: 3100, unit: "1kg", origin: "Lagos mills", desc: "Premium semolina for a quick, fluffy swallow.", q: "semolina,flour" },
    { name: "Roasted Groundnut", price: 2600, unit: "500g", origin: "Kano fields", desc: "Slow-roasted groundnuts, lightly salted — for chops, soup or snacking.", q: "roasted,groundnut,peanut" },
  ],
  "liquids-oils": [
    { name: "Pure Red Palm Oil", price: 4500, unit: "75cl", origin: "Akamkpa cooperative", desc: "Cold-pressed, unrefined palm oil with deep carotenoid colour.", q: "red,palm,oil,bottle" },
    { name: "Groundnut Oil", price: 5200, unit: "1L", origin: "Kano press", desc: "Cold-pressed groundnut oil. Light, nutty, ideal for stews and frying.", q: "peanut,oil,bottle" },
    { name: "Palm Kernel Oil (Adin Dudu)", price: 3800, unit: "50cl", origin: "Cross River", desc: "Black palm kernel oil — traditional remedy and rich cooking base.", q: "black,oil,bottle,herbal" },
    { name: "Virgin Coconut Oil", price: 4900, unit: "50cl", origin: "Badagry coast", desc: "Cold-extracted virgin coconut oil. Skin, hair and pan-ready.", q: "coconut,oil,bottle" },
    { name: "Raw Shea Butter", price: 5800, unit: "500g", origin: "Niger State", desc: "Hand-churned, unrefined ivory shea butter.", q: "shea,butter,african" },
    { name: "Zobo Drink Mix", price: 1900, unit: "250g", origin: "Northern markets", desc: "Dried hibiscus petals with cloves and ginger. Steep for tart, ruby zobo.", q: "hibiscus,zobo,tea,red" },
    { name: "Kunu Aya (Tigernut) Concentrate", price: 2400, unit: "50cl", origin: "Plateau", desc: "Fresh tigernut milk with dates — naturally sweet, no preservatives.", q: "tigernut,milk,drink" },
    { name: "Palm Wine (Chilled)", price: 2200, unit: "75cl", origin: "Akwa Ibom tappers", desc: "Same-day tapped palm wine. Drink chilled within 24 hours.", q: "palm,wine,calabash" },
    { name: "Fresh Coconut Water", price: 1600, unit: "50cl", origin: "Badagry coast", desc: "Pressed-to-order green coconut water.", q: "coconut,water,fresh" },
    { name: "Soya Milk (Unsweetened)", price: 2100, unit: "75cl", origin: "Jos collective", desc: "Stone-ground soya milk — protein-rich, fridge-fresh.", q: "soy,milk,bottle" },
    { name: "Local Honey (Raw)", price: 6800, unit: "75cl", origin: "Adamawa hills", desc: "Raw, unfiltered wildflower honey from the Mambilla plateau.", q: "honey,jar,raw" },
  ],
  "fresh-produce": [
    { name: "Fresh Ugu Leaves", price: 1500, unit: "bunch", origin: "Akpabuyo Farms", desc: "Hand-picked fluted pumpkin leaves, tender and iron-rich.", q: "pumpkin,leaves,green" },
    { name: "Bitter Leaf (Washed)", price: 1700, unit: "500g", origin: "Enugu farms", desc: "Pre-washed bitter leaf — ready for ofe onugbu or egusi.", q: "bitter,leaf,green,african" },
    { name: "Waterleaf", price: 1200, unit: "bunch", origin: "Calabar South", desc: "Soft waterleaf to soften edikang ikong and afang soups.", q: "spinach,leafy,green" },
    { name: "Scent Leaf (Nchanwu / Efinrin)", price: 1300, unit: "bunch", origin: "Ogun farms", desc: "Fragrant scent leaf — perfect for pepper soup and ofada stew.", q: "basil,leaves,herb" },
    { name: "Uziza Leaves", price: 1400, unit: "bunch", origin: "Imo farms", desc: "Peppery uziza leaves — a quiet kick in egusi and nsala.", q: "uziza,green,leaves" },
    { name: "Afang Leaves (Shredded)", price: 2100, unit: "500g", origin: "Akwa Ibom", desc: "Hand-shredded afang ready for soup. No grit, no stems.", q: "shredded,greens,vegetable" },
    { name: "Okazi / Ukazi", price: 2400, unit: "500g", origin: "Imo farms", desc: "Finely sliced okazi leaves for soup or sauce.", q: "sliced,greens,african" },
    { name: "Editan Leaves", price: 2200, unit: "500g", origin: "Akwa Ibom", desc: "Bitter editan, the heart of afia efere — pre-washed.", q: "leafy,herb,bitter" },
    { name: "Fresh Okra", price: 1800, unit: "1kg", origin: "Benue farms", desc: "Tender young okra, sliceable and slime-rich.", q: "okra,vegetable,green" },
    { name: "Garden Eggs (Anara)", price: 1600, unit: "1kg", origin: "Nsukka", desc: "Crisp white garden eggs — serve with groundnut paste.", q: "garden,egg,eggplant,white" },
    { name: "Vine Tomatoes", price: 2800, unit: "2kg basket", origin: "Jos plateau", desc: "Sun-ripened roma tomatoes, no chemical sprays.", q: "vine,tomatoes,red,basket" },
    { name: "Ripe Plantain", price: 3200, unit: "bunch", origin: "Calabar South", desc: "Sun-ripened plantain — dodo, kelewele, or oven chips.", q: "ripe,plantain,yellow" },
  ],
  "tubers-roots": [
    { name: "Whole Puna Yam", price: 6800, unit: "tuber", origin: "Benue heartland", desc: "Dense, creamy yam — pounded yam, asaro, or roasted with palm oil.", q: "yam,tuber,african" },
    { name: "Water Yam", price: 5400, unit: "tuber", origin: "Cross River", desc: "Smooth water yam — best for ikokore and ojojo.", q: "water,yam,tuber" },
    { name: "Cocoyam Corms", price: 4200, unit: "1kg", origin: "Enugu farms", desc: "Cocoyam corms — thicken ofe nsala and ofe onugbu naturally.", q: "cocoyam,taro,root" },
    { name: "Sweet Potato", price: 2800, unit: "2kg", origin: "Plateau", desc: "Orange-flesh sweet potatoes — roast, mash or porridge.", q: "sweet,potato,orange" },
    { name: "Irish Potato", price: 3400, unit: "2kg", origin: "Jos plateau", desc: "Floury Jos potatoes — perfect for stew, chips or porridge.", q: "potato,brown,sack" },
    { name: "Fresh Cassava Tuber", price: 2200, unit: "2kg", origin: "Oyo farms", desc: "Cassava tubers — boil, fry or grind into fufu.", q: "cassava,root,tuber" },
    { name: "Cocoyam Flour (Achi)", price: 2900, unit: "500g", origin: "Imo farms", desc: "Achi thickener for ofe owerri and nsala.", q: "achi,thickener,flour" },
    { name: "Fresh Ginger", price: 2400, unit: "500g", origin: "Kaduna farms", desc: "Pungent fresh ginger — peppered, juiced or stewed.", q: "ginger,root,fresh" },
    { name: "Fresh Garlic", price: 2600, unit: "500g", origin: "Kaduna farms", desc: "Plump local garlic — full-bodied flavour, papery skin.", q: "garlic,bulb,fresh" },
    { name: "Green Unripe Plantain", price: 2800, unit: "bunch", origin: "Boki highlands", desc: "Low-sugar green plantain — boil, fry or grill.", q: "green,plantain,unripe" },
    { name: "White Sweet Potato", price: 2600, unit: "2kg", origin: "Plateau", desc: "White-flesh sweet potatoes — milder, drier crumb.", q: "white,sweet,potato" },
    { name: "Turmeric Root", price: 2300, unit: "300g", origin: "Kogi farms", desc: "Bright, earthy fresh turmeric — grate into stews or tea.", q: "turmeric,root,orange" },
  ],
  proteins: [
    { name: "Smoked Crayfish", price: 5200, unit: "250g", origin: "Bakassi coast", desc: "Wood-smoked crayfish — umami spine of banga, egusi and pepper soup.", q: "dried,crayfish,shrimp" },
    { name: "Stockfish Head (Okporoko)", price: 7800, unit: "piece", origin: "Calabar imports", desc: "Premium Norwegian stockfish head, deeply savoury for ofe nsala.", q: "stockfish,dried,cod" },
    { name: "Smoked Catfish", price: 6400, unit: "large", origin: "Lokoja farms", desc: "Whole smoked catfish — soup-ready, no bone surprises.", q: "smoked,catfish,whole" },
    { name: "Ponmo (Cow Skin)", price: 3200, unit: "500g", origin: "Lagos abattoir", desc: "Cleaned, pre-boiled ponmo — chewy, gelatinous, ready for stew.", q: "cow,skin,ponmo" },
    { name: "Goat Meat (Cut)", price: 8900, unit: "1kg", origin: "Sokoto pastures", desc: "Free-range goat, cleanly butchered and portioned.", q: "goat,meat,raw" },
    { name: "Shaki (Cow Tripe)", price: 4500, unit: "500g", origin: "Lagos abattoir", desc: "Honeycomb tripe, scrubbed and pre-boiled for pepper soup.", q: "tripe,cow,offal" },
    { name: "Smoked Titus (Mackerel)", price: 5600, unit: "2 pieces", origin: "Lagos port", desc: "Smoked mackerel — pull apart for jollof or stew.", q: "smoked,mackerel,fish" },
    { name: "Fresh Periwinkle (Shelled)", price: 3800, unit: "500g", origin: "Cross River creeks", desc: "Hand-shelled periwinkles — the salt of afang and edikang ikong.", q: "periwinkle,shellfish" },
    { name: "Live Land Snails", price: 4900, unit: "5 pieces", origin: "Ondo farms", desc: "Live giant land snails — cleaned to order on request.", q: "snail,african,giant" },
    { name: "Chicken (Whole, Free-Range)", price: 9800, unit: "1.5kg", origin: "Ogun farms", desc: "Free-range hen — firm flesh, deep flavour.", q: "whole,chicken,raw" },
    { name: "Smoked Bonga Fish", price: 3600, unit: "4 pieces", origin: "Lagos port", desc: "Sweet, oily bonga — quick stews and rice dishes.", q: "smoked,fish,bonga" },
    { name: "Dry Prawns", price: 4400, unit: "200g", origin: "Bakassi coast", desc: "Sun-dried prawns — fragrant, lightly salted.", q: "dried,prawns,shrimp" },
  ],
  "spices-seasonings": [
    { name: "Scotch Bonnet (Rodo)", price: 1800, unit: "500g", origin: "Ikom valley", desc: "Fiery, fruit-forward scotch bonnets blended with vine tomatoes.", q: "scotch,bonnet,pepper,red" },
    { name: "Yaji (Suya Spice)", price: 2200, unit: "200g", origin: "Kano spice market", desc: "Classic suya blend — groundnut, ginger, kuli kuli and cayenne.", q: "spice,blend,red,powder" },
    { name: "Uda (Negro Pepper)", price: 1900, unit: "100g", origin: "Cross River", desc: "Whole uda pods — for postpartum pepper soup and game meat.", q: "negro,pepper,pods,dried" },
    { name: "Ehuru (Calabash Nutmeg)", price: 2400, unit: "100g", origin: "Imo forests", desc: "Roasted ehuru seeds — perfumed nutmeg for nsala and ofe owerri.", q: "nutmeg,seeds,brown" },
    { name: "Uziza Seeds", price: 1800, unit: "100g", origin: "Imo farms", desc: "Sharp, peppery uziza seeds — grind fresh into soup.", q: "peppercorn,seeds,black" },
    { name: "Iru (Locust Beans, Wet)", price: 1600, unit: "200g", origin: "Kwara market", desc: "Fermented iru — the funky soul of ewedu, egusi and obe ata.", q: "fermented,locust,bean" },
    { name: "Ogiri Igbo", price: 2100, unit: "150g", origin: "Imo collective", desc: "Fermented melon seed paste — pungent depth for ofe owerri.", q: "fermented,paste,african" },
    { name: "Cameroon Pepper", price: 2600, unit: "150g", origin: "Calabar imports", desc: "Smoky, slow-burn dried pepper — grind for nsala and pepper soup.", q: "dried,red,chilli,powder" },
    { name: "Dawadawa (Dry Locust Bean)", price: 1900, unit: "150g", origin: "Niger State", desc: "Dried fermented dawadawa cakes — break into soups for umami.", q: "dawadawa,bean,cake" },
    { name: "Alligator Pepper", price: 2300, unit: "100g", origin: "Edo forests", desc: "Whole alligator pepper pods — citrussy, warming kick.", q: "alligator,pepper,pods" },
    { name: "Local Curry Leaves", price: 1400, unit: "50g", origin: "Lagos farms", desc: "Fresh curry leaves — fragrant lift for stews and rice.", q: "curry,leaves,fresh" },
    { name: "Dry Pepper (Ata Gungun)", price: 2000, unit: "200g", origin: "Sokoto fields", desc: "Sun-dried red pepper, coarsely ground — deep heat, deep colour.", q: "dried,red,pepper,ground" },
  ],
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const products: Product[] = Object.entries(seeds).flatMap(
  ([cat, list]) =>
    list.map((s) => {
      const id = `${cat}-${slugify(s.name)}`;
      return {
        id,
        name: s.name,
        price: s.price,
        unit: s.unit,
        image: img(s.q, id),
        category: cat as CategorySlug,
        origin: s.origin,
        description: s.desc,
      };
    }),
);

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const productsByCategory = (slug: CategorySlug) =>
  products.filter((p) => p.category === slug);

export const getSimilar = (id: string, limit = 4) => {
  const p = getProduct(id);
  if (!p) return [];
  return products
    .filter((x) => x.id !== id && x.category === p.category)
    .slice(0, limit);
};

export const formatNaira = (n: number) =>
  "₦" + n.toLocaleString("en-NG", { maximumFractionDigits: 0 });

export const categoryName = (slug: CategorySlug) =>
  categories.find((c) => c.slug === slug)?.name ?? slug;
