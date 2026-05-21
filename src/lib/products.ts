import ugu from "@/assets/ugu.jpg";
import yam from "@/assets/yam.jpg";
import plantain from "@/assets/plantain.jpg";
import palmoil from "@/assets/palmoil.jpg";
import crayfish from "@/assets/crayfish.jpg";
import peppers from "@/assets/peppers.jpg";
import garri from "@/assets/garri.jpg";
import banana from "@/assets/banana.jpg";

export type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  origin: string;
  description: string;
};

export const products: Product[] = [
  {
    id: "ugu-leaves",
    name: "Fresh Ugu Leaves",
    price: 1500,
    unit: "bunch",
    image: ugu,
    category: "Greens",
    origin: "Akpabuyo Farms, Cross River",
    description:
      "Hand-picked fluted pumpkin leaves harvested at dawn. Tender, iron-rich and ideal for Edikang Ikong, Egusi or fresh smoothies.",
  },
  {
    id: "yam-tubers",
    name: "Whole Yam Tubers",
    price: 6800,
    unit: "tuber",
    image: yam,
    category: "Tubers",
    origin: "Benue heartland",
    description:
      "Dense, creamy puna yam tubers — perfect for pounded yam, asaro or roasted yam with palm oil sauce.",
  },
  {
    id: "ripe-plantain",
    name: "Ripe Plantain",
    price: 3200,
    unit: "bunch",
    image: plantain,
    category: "Fruit",
    origin: "Calabar South",
    description:
      "Sun-ripened plantain bunch, sweet enough for dodo, kelewele or oven-baked plantain chips.",
  },
  {
    id: "palm-oil",
    name: "Pure Red Palm Oil",
    price: 4500,
    unit: "75cl bottle",
    image: palmoil,
    category: "Pantry",
    origin: "Akamkpa cooperatives",
    description:
      "Cold-pressed, unrefined palm oil with deep carotenoid color. Bottled within 48 hours of pressing.",
  },
  {
    id: "dry-crayfish",
    name: "Smoked Crayfish",
    price: 5200,
    unit: "250g",
    image: crayfish,
    category: "Protein",
    origin: "Bakassi coast",
    description:
      "Wood-smoked crayfish, ground or whole — the umami spine of a great Banga, Egusi or pepper soup.",
  },
  {
    id: "scotch-peppers",
    name: "Scotch Bonnet Mix",
    price: 1800,
    unit: "500g",
    image: peppers,
    category: "Spice",
    origin: "Ikom valley",
    description:
      "Fiery, fruit-forward scotch bonnets blended with vine tomatoes. Stew-ready, no fillers.",
  },
  {
    id: "garri-egusi",
    name: "White Garri & Egusi",
    price: 2400,
    unit: "1kg combo",
    image: garri,
    category: "Pantry",
    origin: "Ogoja mills",
    description:
      "Stone-free, finely sifted Ijebu garri paired with first-grade melon seed. Soak, sip, or stir into soup.",
  },
  {
    id: "unripe-banana",
    name: "Green Cooking Banana",
    price: 2800,
    unit: "bunch",
    image: banana,
    category: "Fruit",
    origin: "Boki highlands",
    description:
      "Low-sugar green banana for boiling, frying or grilling — a quiet staple of Cross River kitchens.",
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const getSimilar = (id: string, limit = 4) =>
  products.filter((p) => p.id !== id).slice(0, limit);

export const formatNaira = (n: number) =>
  "₦" + n.toLocaleString("en-NG", { maximumFractionDigits: 0 });
