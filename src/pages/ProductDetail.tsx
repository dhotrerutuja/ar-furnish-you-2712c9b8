import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Minus, Plus, ChevronRight } from "lucide-react";
import { products, formatPrice } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/products/ProductCard";
import ReviewSection from "@/components/products/ReviewSection";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="ikea-container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/products" className="text-primary hover:underline">Browse all products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({ title: "Added to cart!", description: `${quantity}× ${product.name} added to cart.` });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-muted border-b border-border">
        <div className="ikea-container py-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/products" className="hover:text-foreground">Products</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{product.name}</span>
        </div>
      </div>

      <div className="ikea-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded overflow-hidden bg-muted">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && <span className="ikea-badge-new text-sm">NEW</span>}
              {discount > 0 && <span className="ikea-badge-sale text-sm">-{discount}%</span>}
              {product.isBestseller && <span className="ikea-badge bg-primary text-primary-foreground text-sm">BESTSELLER</span>}
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-black text-foreground">{product.name}</h1>
            <p className="text-lg text-muted-foreground mt-1">{product.subcategory}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`h-4 w-4 ${star <= Math.floor(product.rating) ? "fill-secondary text-secondary" : "text-border"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-6">
              <div className="flex items-baseline gap-3">
                <span className="price-tag text-foreground">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                )}
                {discount > 0 && (
                  <span className="text-sm font-bold text-success">Save {discount}%</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Price includes GST</p>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mt-6 leading-relaxed">{product.description}</p>

            {/* Details */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Material</p>
                <p className="text-sm font-medium text-foreground">{product.material}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Colour</p>
                <p className="text-sm font-medium text-foreground">{product.color}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dimensions</p>
                <p className="text-sm font-medium text-foreground">{product.dimensions}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Availability</p>
                <p className={`text-sm font-medium ${product.inStock ? "text-success" : "text-destructive"}`}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <p className="text-sm font-medium text-foreground mb-2">Quantity</p>
              <div className="flex items-center gap-0 border border-border rounded w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-muted transition-colors">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 text-sm font-medium min-w-[40px] text-center border-x border-border">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-muted transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3.5 px-6 rounded-full hover:brightness-110 transition-all"
              >
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-bold py-3.5 px-6 rounded-full hover:brightness-95 transition-all"
              >
                Buy Now
              </button>
              <button
                onClick={() => {
                  toggleWishlist(product);
                  toast({ title: wishlisted ? "Removed from wishlist" : "Added to wishlist" });
                }}
                className={`h-12 w-12 rounded-full border flex items-center justify-center transition-colors flex-shrink-0 ${
                  wishlisted ? "bg-destructive/10 border-destructive" : "border-border hover:bg-muted"
                }`}
              >
                <Heart className={`h-5 w-5 ${wishlisted ? "fill-destructive text-destructive" : "text-foreground"}`} />
              </button>
            </div>

            {/* Delivery info */}
            <div className="mt-6 space-y-3 border-t border-border pt-6">
              {[
                { icon: Truck, text: "Free delivery on orders above ₹5,000" },
                { icon: Shield, text: "10-year quality guarantee" },
                { icon: RotateCcw, text: "14-day easy returns" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <ReviewSection productId={product.id} />

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-foreground mb-6">You may also like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
