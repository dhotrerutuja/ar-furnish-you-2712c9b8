import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, products } from "@/data/products";

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WL_KEY = "vh_wishlist";

const loadWishlist = (): Product[] => {
  try {
    const raw = localStorage.getItem(WL_KEY);
    if (!raw) return [];
    const ids: string[] = JSON.parse(raw);
    return ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[];
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Product[]>(loadWishlist);

  useEffect(() => {
    localStorage.setItem(WL_KEY, JSON.stringify(items.map((p) => p.id)));
  }, [items]);

  const addToWishlist = (product: Product) => {
    setItems((prev) => (prev.find((p) => p.id === product.id) ? prev : [...prev, product]));
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const isInWishlist = (productId: string) => items.some((p) => p.id === productId);

  const toggleWishlist = (product: Product) => {
    isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
