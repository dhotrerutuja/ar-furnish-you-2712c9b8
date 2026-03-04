// Re-export everything from the refactored modules
export type { Product, Category } from "./types";
export { formatPrice } from "./types";
export { categories, products } from "./products/index";
