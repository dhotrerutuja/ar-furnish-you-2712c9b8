import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3, Package, ShoppingBag, Star, ArrowLeft,
  IndianRupee, Heart, ShoppingCart, User, Mail, Phone,
} from "lucide-react";
import { products, categories, formatPrice } from "@/data/products";
import { useOrders } from "@/contexts/OrderContext";
import { useReviews } from "@/contexts/ReviewContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type Tab = "dashboard" | "products" | "orders" | "reviews" | "cart" | "wishlist";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const { orders } = useOrders();
  const { reviews, getAverageRating, getProductReviews } = useReviews();
  const { items: cartItems, totalItems, totalPrice, gst, deliveryCharge, grandTotal } = useCart();
  const { items: wishlistItems } = useWishlist();

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalReviews = reviews.length;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

  const categoryCounts = categories.map((c) => ({
    name: c.name,
    count: products.filter((p) => p.category === c.id).length,
  }));

  const tabs: { id: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag, badge: totalOrders },
    { id: "cart", label: "Cart", icon: ShoppingCart, badge: totalItems },
    { id: "wishlist", label: "Wishlist", icon: Heart, badge: wishlistItems.length },
    { id: "reviews", label: "Reviews", icon: Star, badge: totalReviews },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="ikea-container py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-2xl font-black text-foreground">Admin Panel</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-background rounded-lg border border-border p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors flex-shrink-0 ${
                activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab.id ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"
                }`}>{tab.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
              {[
                { label: "Revenue", value: totalRevenue > 0 ? formatPrice(totalRevenue) : "₹0", icon: IndianRupee, color: "text-success" },
                { label: "Products", value: totalProducts.toString(), icon: Package, color: "text-primary" },
                { label: "Orders", value: totalOrders.toString(), icon: ShoppingBag, color: "text-secondary-foreground" },
                { label: "Cart Items", value: totalItems.toString(), icon: ShoppingCart, color: "text-primary" },
                { label: "Wishlist", value: wishlistItems.length.toString(), icon: Heart, color: "text-destructive" },
                { label: "Avg Rating", value: avgRating, icon: Star, color: "text-secondary" },
              ].map((stat) => (
                <div key={stat.label} className="bg-background rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-black text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Category breakdown */}
            <div className="bg-background rounded-lg border border-border p-6 mb-6">
              <h3 className="font-bold text-foreground mb-4">Products by Category</h3>
              <div className="space-y-3">
                {categoryCounts.map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-40 truncate">{c.name}</span>
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(c.count / totalProducts) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium text-foreground w-8 text-right">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active cart summary */}
            {totalItems > 0 && (
              <div className="bg-background rounded-lg border border-border p-6 mb-6">
                <h3 className="font-bold text-foreground mb-4">🛒 Active Cart</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Items</p><p className="font-bold text-foreground">{totalItems}</p></div>
                  <div><p className="text-muted-foreground">Subtotal</p><p className="font-bold text-foreground">{formatPrice(totalPrice)}</p></div>
                  <div><p className="text-muted-foreground">GST (18%)</p><p className="font-bold text-foreground">{formatPrice(gst)}</p></div>
                  <div><p className="text-muted-foreground">Grand Total</p><p className="font-bold text-foreground text-primary">{formatPrice(grandTotal)}</p></div>
                </div>
              </div>
            )}

            {/* Recent orders */}
            <div className="bg-background rounded-lg border border-border p-6">
              <h3 className="font-bold text-foreground mb-4">Recent Orders</h3>
              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No orders yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-muted-foreground font-medium">Order ID</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Customer</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Items</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Amount</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Status</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-b border-border last:border-0">
                          <td className="py-3 font-medium text-foreground">{order.id}</td>
                          <td className="py-3 text-muted-foreground">{order.customer?.name || "N/A"}</td>
                          <td className="py-3 text-muted-foreground">{order.items.length} items</td>
                          <td className="py-3 text-foreground">{formatPrice(order.totalAmount)}</td>
                          <td className="py-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              order.status === "delivered" ? "bg-success/10 text-success" :
                              order.status === "shipped" ? "bg-primary/10 text-primary" :
                              "bg-secondary/30 text-secondary-foreground"
                            }`}>{order.status.replace(/-/g, " ").toUpperCase()}</span>
                          </td>
                          <td className="py-3 text-muted-foreground">{order.createdAt.toLocaleDateString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products — now with live ratings */}
        {activeTab === "products" && (
          <div className="bg-background rounded-lg border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-bold text-foreground">All Products ({totalProducts})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-3 text-muted-foreground font-medium">Product</th>
                    <th className="text-left p-3 text-muted-foreground font-medium hidden sm:table-cell">Category</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">Price</th>
                    <th className="text-left p-3 text-muted-foreground font-medium hidden md:table-cell">Rating</th>
                    <th className="text-left p-3 text-muted-foreground font-medium hidden md:table-cell">Reviews</th>
                    <th className="text-left p-3 text-muted-foreground font-medium hidden lg:table-cell">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const liveReviews = getProductReviews(product.id);
                    const liveRating = getAverageRating(product.id);
                    const displayRating = liveReviews.length > 0 ? liveRating : product.rating;
                    const displayCount = liveReviews.length > 0 ? liveReviews.length : product.reviewCount;
                    return (
                      <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover flex-shrink-0" />
                            <div>
                              <p className="font-medium text-foreground">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.subcategory}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground hidden sm:table-cell capitalize">{product.category}</td>
                        <td className="p-3 text-foreground font-medium">{formatPrice(product.price)}</td>
                        <td className="p-3 hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-secondary text-secondary" />
                            <span className="text-foreground">{displayRating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="p-3 hidden md:table-cell text-muted-foreground">{displayCount}</td>
                        <td className="p-3 hidden lg:table-cell">
                          <span className={`text-xs px-2 py-1 rounded-full ${product.inStock ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders with customer details */}
        {activeTab === "orders" && (
          <div className="bg-background rounded-lg border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-bold text-foreground">All Orders ({totalOrders})</h3>
            </div>
            {orders.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No orders yet. Place an order from the shop to see it here.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Order info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-primary text-sm">{order.id}</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            order.status === "delivered" ? "bg-success/10 text-success" :
                            order.status === "shipped" ? "bg-primary/10 text-primary" :
                            "bg-secondary/30 text-secondary-foreground"
                          }`}>{order.status.replace(/-/g, " ").toUpperCase()}</span>
                          <span className="text-xs text-muted-foreground">{order.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>

                        {/* Customer details */}
                        <div className="bg-muted/50 rounded-md p-3 space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium text-foreground">{order.customer?.name || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">{order.customer?.email || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">{order.customer?.phone || "N/A"}</span>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 bg-background border border-border rounded-md px-2 py-1">
                              <img src={item.product.image} alt={item.product.name} className="h-8 w-8 rounded object-cover" />
                              <div>
                                <p className="text-xs font-medium text-foreground">{item.product.name}</p>
                                <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Amount & payment */}
                      <div className="text-right space-y-1 flex-shrink-0">
                        <p className="text-lg font-black text-foreground">{formatPrice(order.totalAmount)}</p>
                        <p className="text-xs text-muted-foreground capitalize">{order.paymentMethod.replace(/-/g, " ")}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cart Tab */}
        {activeTab === "cart" && (
          <div className="bg-background rounded-lg border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-bold text-foreground">Cart Items ({totalItems})</h3>
            </div>
            {cartItems.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Cart is empty. Items added to cart will show here in real-time.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left p-3 text-muted-foreground font-medium">Product</th>
                        <th className="text-left p-3 text-muted-foreground font-medium">Price</th>
                        <th className="text-left p-3 text-muted-foreground font-medium">Qty</th>
                        <th className="text-left p-3 text-muted-foreground font-medium">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.product.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img src={item.product.image} alt={item.product.name} className="h-10 w-10 rounded object-cover flex-shrink-0" />
                              <div>
                                <p className="font-medium text-foreground">{item.product.name}</p>
                                <p className="text-xs text-muted-foreground">{item.product.subcategory}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-foreground">{formatPrice(item.product.price)}</td>
                          <td className="p-3 text-foreground font-medium">{item.quantity}</td>
                          <td className="p-3 text-foreground font-bold">{formatPrice(item.product.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-border bg-muted/30">
                  <div className="flex flex-col gap-1 text-sm max-w-xs ml-auto">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">{formatPrice(totalPrice)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span className="text-foreground">{formatPrice(gst)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-foreground">{deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}</span></div>
                    <div className="flex justify-between border-t border-border pt-1 mt-1"><span className="font-bold text-foreground">Grand Total</span><span className="font-bold text-primary">{formatPrice(grandTotal)}</span></div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === "wishlist" && (
          <div className="bg-background rounded-lg border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-bold text-foreground">Wishlist Items ({wishlistItems.length})</h3>
            </div>
            {wishlistItems.length === 0 ? (
              <div className="p-8 text-center">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Wishlist is empty. Items added to wishlist will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-3 text-muted-foreground font-medium">Product</th>
                      <th className="text-left p-3 text-muted-foreground font-medium">Category</th>
                      <th className="text-left p-3 text-muted-foreground font-medium">Price</th>
                      <th className="text-left p-3 text-muted-foreground font-medium hidden md:table-cell">Rating</th>
                      <th className="text-left p-3 text-muted-foreground font-medium hidden lg:table-cell">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlistItems.map((product) => {
                      const lr = getProductReviews(product.id);
                      const rating = lr.length > 0 ? getAverageRating(product.id) : product.rating;
                      return (
                        <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover flex-shrink-0" />
                              <div>
                                <p className="font-medium text-foreground">{product.name}</p>
                                <p className="text-xs text-muted-foreground">{product.subcategory}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-muted-foreground capitalize">{product.category}</td>
                          <td className="p-3 text-foreground font-medium">{formatPrice(product.price)}</td>
                          <td className="p-3 hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-secondary text-secondary" />
                              <span className="text-foreground">{rating.toFixed(1)}</span>
                            </div>
                          </td>
                          <td className="p-3 hidden lg:table-cell">
                            <span className={`text-xs px-2 py-1 rounded-full ${product.inStock ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <div className="bg-background rounded-lg border border-border">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground">All Reviews ({totalReviews})</h3>
              <span className="text-sm text-muted-foreground">Avg: {avgRating} ★</span>
            </div>
            {reviews.length === 0 ? (
              <div className="p-8 text-center">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No reviews yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {reviews.map((review) => {
                  const product = products.find((p) => p.id === review.productId);
                  return (
                    <div key={review.id} className="p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start gap-3">
                        {product && <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover flex-shrink-0" />}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground">{product?.name || "Unknown"}</p>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`h-3 w-3 ${s <= review.rating ? "fill-secondary text-secondary" : "text-border"}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{review.userName} · {review.createdAt.toLocaleDateString("en-IN")}</p>
                          <p className="text-sm text-foreground mt-1">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
