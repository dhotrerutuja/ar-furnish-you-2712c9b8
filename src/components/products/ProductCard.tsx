import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product, formatPrice } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useReviews } from "@/contexts/ReviewContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { getAverageRating, getProductReviews } = useReviews();
  const { toast } = useToast();
  const wishlisted = isInWishlist(product.id);
  const liveRating = getAverageRating(product.id);
  const liveReviewCount = getProductReviews(product.id).length;
  const displayRating = liveReviewCount > 0 ? liveRating : product.rating;
  const displayReviewCount = liveReviewCount > 0 ? liveReviewCount : product.reviewCount;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({ title: "Added to cart", description: `${product.name} has been added to your cart.` });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast({
      title: wishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${wishlisted ? "removed from" : "added to"} your wishlist.`,
    });
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="product-card-hover rounded-sm overflow-hidden bg-card">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && <span className="ikea-badge-new">NEW</span>}
            {product.originalPrice && (
              <span className="ikea-badge-sale">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            )}
            {product.isBestseller && (
              <span className="ikea-badge bg-primary text-primary-foreground">BESTSELLER</span>
            )}
          </div>
          {/* Wishlist button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-destructive text-destructive" : "text-foreground"}`} />
          </button>
          {/* Quick add */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-bold text-sm text-foreground">{product.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{product.subcategory}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="price-tag-small text-foreground">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {/* Rating */}
          <div className="mt-1.5 flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= Math.floor(displayRating) ? "fill-secondary text-secondary" : "text-border"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">({displayReviewCount})</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
