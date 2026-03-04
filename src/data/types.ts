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

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};
