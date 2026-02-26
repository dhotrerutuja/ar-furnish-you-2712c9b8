import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="ikea-container py-20 text-center">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-6">Save items you love to find them easily later.</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-full">
            Start Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="ikea-container py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">My Wishlist ({items.length} items)</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((product) => (
            <div key={product.id} className="bg-card border border-border rounded overflow-hidden product-card-hover">
              <Link to={`/product/${product.id}`}>
                <div className="aspect-square bg-muted">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
              </Link>
              <div className="p-3">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-bold text-sm text-foreground">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">{product.subcategory}</p>
                  <p className="price-tag-small text-foreground mt-1">{formatPrice(product.price)}</p>
                </Link>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      addToCart(product);
                      toast({ title: "Added to cart", description: `${product.name} added to cart.` });
                    }}
                    className="flex-1 flex items-center justify-center gap-1 bg-primary text-primary-foreground text-xs font-bold py-2 rounded-full hover:brightness-110 transition-all"
                  >
                    <ShoppingCart className="h-3 w-3" /> Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="h-8 w-8 flex items-center justify-center border border-border rounded-full hover:bg-muted transition-colors"
                  >
                    <Heart className="h-3 w-3 fill-destructive text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
