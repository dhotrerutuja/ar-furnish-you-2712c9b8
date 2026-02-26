import sofa1 from "@/assets/products/sofa-1.jpg";
import diningTable1 from "@/assets/products/dining-table-1.jpg";
import bed1 from "@/assets/products/bed-1.jpg";
import bookshelf1 from "@/assets/products/bookshelf-1.jpg";
import desk1 from "@/assets/products/desk-1.jpg";
import armchair1 from "@/assets/products/armchair-1.jpg";
import coffeeTable1 from "@/assets/products/coffee-table-1.jpg";
import wardrobe1 from "@/assets/products/wardrobe-1.jpg";
import tvUnit1 from "@/assets/products/tv-unit-1.jpg";
import kitchenCabinet1 from "@/assets/products/kitchen-cabinet-1.jpg";
import nightstand1 from "@/assets/products/nightstand-1.jpg";

export interface Product {
  id: string;
  name: string;
  nameHindi?: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  description: string;
  material: string;
  color: string;
  dimensions: string;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

export const categories: Category[] = [
  { id: "sofas", name: "Sofas & Armchairs", image: sofa1, productCount: 45 },
  { id: "beds", name: "Beds & Mattresses", image: bed1, productCount: 32 },
  { id: "tables", name: "Tables & Desks", image: diningTable1, productCount: 58 },
  { id: "storage", name: "Storage & Organisation", image: bookshelf1, productCount: 67 },
  { id: "kitchen", name: "Kitchen & Dining", image: kitchenCabinet1, productCount: 41 },
  { id: "office", name: "Home Office", image: desk1, productCount: 29 },
];

export const products: Product[] = [
  {
    id: "1",
    name: "LANDSKRONA",
    category: "sofas",
    subcategory: "3-seat sofa",
    price: 34990,
    originalPrice: 42990,
    image: sofa1,
    images: [sofa1],
    rating: 4.5,
    reviewCount: 128,
    description: "A timeless sofa with a modern expression. The deep seat, supportive back cushions and soft upholstery make it perfect for lounging.",
    material: "Fabric",
    color: "Grey",
    dimensions: "204×89×78 cm",
    inStock: true,
    isBestseller: true,
    tags: ["living-room", "sofa", "fabric"],
  },
  {
    id: "2",
    name: "MÖRBYLÅNGA",
    category: "tables",
    subcategory: "Dining table",
    price: 44990,
    image: diningTable1,
    images: [diningTable1],
    rating: 4.7,
    reviewCount: 89,
    description: "Every table is unique, with varying grain pattern and natural colour shifts that are part of the charm of wood.",
    material: "Oak veneer",
    color: "Oak",
    dimensions: "140×85×74 cm",
    inStock: true,
    isNew: true,
    tags: ["dining", "table", "wood"],
  },
  {
    id: "3",
    name: "MALM",
    category: "beds",
    subcategory: "Bed frame",
    price: 14990,
    originalPrice: 17990,
    image: bed1,
    images: [bed1],
    rating: 4.3,
    reviewCount: 256,
    description: "A clean design that's just as beautiful on all sides – place the bed on its own or with the headboard against a wall.",
    material: "Particleboard",
    color: "Oak veneer",
    dimensions: "209×156×100 cm",
    inStock: true,
    isBestseller: true,
    tags: ["bedroom", "bed", "wood"],
  },
  {
    id: "4",
    name: "BILLY",
    category: "storage",
    subcategory: "Bookcase",
    price: 4490,
    image: bookshelf1,
    images: [bookshelf1],
    rating: 4.6,
    reviewCount: 512,
    description: "A simple and practical bookcase for your favourite books and decorative items. Adjustable shelves adapt to your needs.",
    material: "Particleboard",
    color: "Oak veneer",
    dimensions: "80×28×202 cm",
    inStock: true,
    isBestseller: true,
    tags: ["storage", "bookcase", "living-room"],
  },
  {
    id: "5",
    name: "BEKANT",
    category: "office",
    subcategory: "Desk",
    price: 22990,
    image: desk1,
    images: [desk1],
    rating: 4.4,
    reviewCount: 167,
    description: "10-year guarantee. Sit/stand desk with a spacious work surface. The counter-balanced table top floats up and down smoothly.",
    material: "Particleboard, Steel",
    color: "White/Oak",
    dimensions: "160×80×65-125 cm",
    inStock: true,
    isNew: true,
    tags: ["office", "desk", "ergonomic"],
  },
  {
    id: "6",
    name: "STRANDMON",
    category: "sofas",
    subcategory: "Wing chair",
    price: 15990,
    image: armchair1,
    images: [armchair1],
    rating: 4.8,
    reviewCount: 203,
    description: "You can really loosen up and relax in comfort because the high back on this chair gives you extra support for your neck.",
    material: "Fabric",
    color: "Yellow",
    dimensions: "82×96×101 cm",
    inStock: true,
    isBestseller: true,
    tags: ["living-room", "armchair", "fabric"],
  },
  {
    id: "7",
    name: "STOCKHOLM",
    category: "tables",
    subcategory: "Coffee table",
    price: 8990,
    image: coffeeTable1,
    images: [coffeeTable1],
    rating: 4.2,
    reviewCount: 94,
    description: "The table surface in walnut veneer and legs in solid walnut give a warm, natural feeling to your room.",
    material: "Solid wood",
    color: "Natural",
    dimensions: "Ø93×40 cm",
    inStock: true,
    tags: ["living-room", "table", "wood"],
  },
  {
    id: "8",
    name: "PAX",
    category: "storage",
    subcategory: "Wardrobe",
    price: 29990,
    originalPrice: 35990,
    image: wardrobe1,
    images: [wardrobe1],
    rating: 4.5,
    reviewCount: 341,
    description: "A wardrobe system you can customise to suit your space. Choose frames, doors, and interior organisers to create your perfect solution.",
    material: "Particleboard",
    color: "Oak effect",
    dimensions: "200×58×236 cm",
    inStock: true,
    tags: ["bedroom", "wardrobe", "storage"],
  },
  {
    id: "9",
    name: "BESTÅ",
    category: "storage",
    subcategory: "TV unit",
    price: 11990,
    image: tvUnit1,
    images: [tvUnit1],
    rating: 4.4,
    reviewCount: 178,
    description: "Keep your TV area tidy with this smart combination. Hide away cables and messy things behind the doors and drawers.",
    material: "Particleboard",
    color: "Oak veneer",
    dimensions: "180×42×39 cm",
    inStock: true,
    tags: ["living-room", "tv-unit", "storage"],
  },
  {
    id: "10",
    name: "METOD",
    category: "kitchen",
    subcategory: "Kitchen cabinet",
    price: 52990,
    image: kitchenCabinet1,
    images: [kitchenCabinet1],
    rating: 4.6,
    reviewCount: 145,
    description: "A complete kitchen solution. The modular system allows you to create a kitchen that suits your space and needs perfectly.",
    material: "Particleboard",
    color: "Oak",
    dimensions: "240×60×228 cm",
    inStock: true,
    isNew: true,
    tags: ["kitchen", "cabinet", "modular"],
  },
  {
    id: "11",
    name: "HEMNES",
    category: "beds",
    subcategory: "Nightstand",
    price: 4990,
    image: nightstand1,
    images: [nightstand1],
    rating: 4.3,
    reviewCount: 198,
    description: "Made of solid wood, which is a durable and warm natural material. The drawer has smooth-running drawer slides.",
    material: "Solid pine",
    color: "Light brown",
    dimensions: "46×35×70 cm",
    inStock: true,
    tags: ["bedroom", "nightstand", "wood"],
  },
  {
    id: "12",
    name: "KALLAX",
    category: "storage",
    subcategory: "Shelf unit",
    price: 6490,
    image: bookshelf1,
    images: [bookshelf1],
    rating: 4.7,
    reviewCount: 423,
    description: "A simple unit can be enough storage for a limited space or the start of a larger storage solution if your needs change.",
    material: "Particleboard",
    color: "Oak effect",
    dimensions: "77×39×147 cm",
    inStock: true,
    isBestseller: true,
    tags: ["storage", "shelf", "living-room"],
  },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};
