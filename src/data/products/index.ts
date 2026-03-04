import sofa1 from "@/assets/products/sofa-1.jpg";
import bed1 from "@/assets/products/bed-1.jpg";
import diningTable1 from "@/assets/products/dining-table-1.jpg";
import bookshelf1 from "@/assets/products/bookshelf-1.jpg";
import kitchenCabinet1 from "@/assets/products/kitchen-cabinet-1.jpg";
import desk1 from "@/assets/products/desk-1.jpg";
import mirror1 from "@/assets/products/mirror-1.jpg";

import { Category } from "../types";
import { sofaProducts } from "./sofas";
import { bedProducts } from "./beds";
import { tableProducts } from "./tables";
import { storageProducts } from "./storage";
import { kitchenProducts } from "./kitchen";
import { officeProducts } from "./office";
import { mirrorProducts } from "./mirrors";

export const categories: Category[] = [
  { id: "sofas", name: "Sofas & Armchairs", image: sofa1, productCount: sofaProducts.length },
  { id: "beds", name: "Beds & Mattresses", image: bed1, productCount: bedProducts.length },
  { id: "tables", name: "Tables & Desks", image: diningTable1, productCount: tableProducts.length },
  { id: "storage", name: "Storage & Organisation", image: bookshelf1, productCount: storageProducts.length },
  { id: "kitchen", name: "Kitchen & Dining", image: kitchenCabinet1, productCount: kitchenProducts.length },
  { id: "office", name: "Home Office", image: desk1, productCount: officeProducts.length },
  { id: "mirrors", name: "Mirrors", image: mirror1, productCount: mirrorProducts.length },
];

export const products = [
  ...sofaProducts,
  ...bedProducts,
  ...tableProducts,
  ...storageProducts,
  ...kitchenProducts,
  ...officeProducts,
  ...mirrorProducts,
];
