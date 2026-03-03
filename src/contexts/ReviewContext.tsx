import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (productId: string, userName: string, rating: number, comment: string) => void;
  getProductReviews: (productId: string) => Review[];
  getAverageRating: (productId: string) => number;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

const REVIEW_KEY = "vh_reviews";

const defaultReviews: Review[] = [
  { id: "r1", productId: "1", userName: "Rahul S.", rating: 5, comment: "Excellent sofa! Very comfortable and great quality fabric.", createdAt: new Date("2026-01-15") },
  { id: "r2", productId: "1", userName: "Priya M.", rating: 4, comment: "Good value for money. Delivery was on time.", createdAt: new Date("2026-01-20") },
  { id: "r3", productId: "3", userName: "Amit K.", rating: 4, comment: "Sturdy bed frame, easy to assemble. Looks great!", createdAt: new Date("2026-02-01") },
  { id: "r4", productId: "4", userName: "Sneha R.", rating: 5, comment: "Perfect bookshelf. Exactly as shown in images.", createdAt: new Date("2026-02-10") },
  { id: "r5", productId: "6", userName: "Vikram P.", rating: 5, comment: "This wing chair is absolutely gorgeous. So comfortable!", createdAt: new Date("2026-02-14") },
];

const loadReviews = (): Review[] => {
  try {
    const raw = localStorage.getItem(REVIEW_KEY);
    if (!raw) return defaultReviews;
    return JSON.parse(raw).map((r: any) => ({ ...r, createdAt: new Date(r.createdAt) }));
  } catch {
    return defaultReviews;
  }
};

export const ReviewProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>(loadReviews);

  useEffect(() => {
    localStorage.setItem(REVIEW_KEY, JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (productId: string, userName: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: "r-" + Date.now(),
      productId,
      userName,
      rating,
      comment,
      createdAt: new Date(),
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const getProductReviews = (productId: string) => reviews.filter((r) => r.productId === productId);

  const getAverageRating = (productId: string) => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return 0;
    return productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
  };

  return (
    <ReviewContext.Provider value={{ reviews, addReview, getProductReviews, getAverageRating }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) throw new Error("useReviews must be used within ReviewProvider");
  return context;
};
