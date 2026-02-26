import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Package, Heart, LogOut, MapPin, Phone, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { formatPrice } from "@/data/products";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Profile = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const { orders } = useOrders();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <div className="ikea-container py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="bg-background rounded border border-border p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-foreground text-lg">{user?.name}</h2>
                <p className="text-sm text-muted-foreground">VirtualHome Member</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4" /> {user?.email}
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4" /> {user?.phone}
              </div>
              {user?.address && (
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5" /> {user.address}, {user.city} - {user.pincode}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="w-full mt-6 flex items-center justify-center gap-2 text-destructive border border-destructive/30 py-2.5 rounded-full hover:bg-destructive/5 transition-colors text-sm font-medium"
            >
              <LogOut className="h-4 w-4" /> Log Out
            </button>
          </div>

          {/* Orders */}
          <div className="lg:col-span-2">
            <div className="bg-background rounded border border-border p-6">
              <h2 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> My Orders
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No orders yet</p>
                  <Link to="/products" className="text-primary font-medium hover:underline text-sm">
                    Start shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-border rounded p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-bold text-foreground">{order.id}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">{formatPrice(order.totalAmount)}</p>
                          <p className="text-xs font-medium text-primary capitalize">{order.status.replace("-", " ")}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 overflow-x-auto">
                        {order.items.map(({ product }) => (
                          <img key={product.id} src={product.image} alt={product.name} className="h-14 w-14 rounded object-cover flex-shrink-0" />
                        ))}
                      </div>
                      <Link
                        to={`/track-order?id=${order.id}`}
                        className="inline-block mt-3 text-xs font-medium text-primary hover:underline"
                      >
                        Track Order →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
