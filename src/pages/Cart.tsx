import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, ChevronRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, gst, deliveryCharge, grandTotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="ikea-container py-20 text-center">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Looks like you haven't added any items yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-full"
          >
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="bg-muted border-b border-border">
        <div className="ikea-container py-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Shopping Cart</span>
        </div>
      </div>

      <div className="ikea-container py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Shopping Cart ({items.length} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-4 bg-card border border-border rounded p-4">
                <Link to={`/product/${product.id}`} className="flex-shrink-0">
                  <img src={product.image} alt={product.name} className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link to={`/product/${product.id}`} className="font-bold text-foreground hover:text-primary text-sm sm:text-base">{product.name}</Link>
                      <p className="text-xs text-muted-foreground">{product.subcategory}</p>
                      <p className="text-xs text-muted-foreground">{product.color} · {product.material}</p>
                    </div>
                    <button onClick={() => removeFromCart(product.id)} className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-0 border border-border rounded">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)} className="px-2 py-1 hover:bg-muted transition-colors">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium border-x border-border">{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)} className="px-2 py-1 hover:bg-muted transition-colors">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{formatPrice(product.price * quantity)}</p>
                      {quantity > 1 && <p className="text-xs text-muted-foreground">{formatPrice(product.price)} each</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded p-6 sticky top-32">
              <h2 className="font-bold text-lg text-foreground mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span className="font-medium text-foreground">{formatPrice(gst)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={`font-medium ${deliveryCharge === 0 ? "text-success" : "text-foreground"}`}>
                    {deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}
                  </span>
                </div>
                {deliveryCharge > 0 && (
                  <p className="text-xs text-muted-foreground">Free delivery on orders above ₹5,000</p>
                )}
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-black text-lg text-foreground">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 bg-primary text-primary-foreground font-bold py-3.5 rounded-full hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </button>

              <Link to="/products" className="block text-center text-sm text-primary hover:underline mt-3">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
