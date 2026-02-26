import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronDown, MapPin } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { categories } from "@/data/products";

const Header = () => {
  const { totalItems } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      {/* Top bar */}
      <div className="bg-foreground">
        <div className="ikea-container flex items-center justify-between py-1.5 text-xs text-primary-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Delivering to India
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Link to="/track-order" className="hover:underline">Track Order</Link>
            <span>Customer Service</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="ikea-container flex items-center gap-4 py-3">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-primary-foreground"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <div className="bg-secondary rounded px-3 py-1">
            <span className="text-xl font-black tracking-tighter text-primary">
              VIRTUAL<span className="text-foreground">HOME</span>
            </span>
          </div>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full rounded-full py-2.5 pl-4 pr-12 text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-muted p-2 hover:bg-border transition-colors">
              <Search className="h-4 w-4 text-foreground" />
            </button>
          </div>
        </form>

        {/* Right icons */}
        <div className="flex items-center gap-1 sm:gap-3 ml-auto">
          {isLoggedIn ? (
            <div className="relative group">
              <Link to="/profile" className="flex flex-col items-center text-primary-foreground hover:opacity-80 transition-opacity">
                <User className="h-5 w-5" />
                <span className="text-[10px] hidden sm:block mt-0.5">Hej, {user?.name.split(" ")[0]}</span>
              </Link>
              <div className="absolute right-0 top-full mt-2 w-48 bg-background rounded shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link to="/profile" className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted">My Profile</Link>
                <Link to="/profile" className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted">My Orders</Link>
                <button onClick={logout} className="block w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-muted">
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="flex flex-col items-center text-primary-foreground hover:opacity-80 transition-opacity">
              <User className="h-5 w-5" />
              <span className="text-[10px] hidden sm:block mt-0.5">Login</span>
            </Link>
          )}

          <Link to="/wishlist" className="relative flex flex-col items-center text-primary-foreground hover:opacity-80 transition-opacity">
            <Heart className="h-5 w-5" />
            <span className="text-[10px] hidden sm:block mt-0.5">Wishlist</span>
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative flex flex-col items-center text-primary-foreground hover:opacity-80 transition-opacity">
            <ShoppingCart className="h-5 w-5" />
            <span className="text-[10px] hidden sm:block mt-0.5">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Category nav */}
      <nav className="hidden lg:block bg-primary border-t border-primary-foreground/20">
        <div className="ikea-container flex items-center gap-6 py-2.5">
          <Link to="/products" className="flex items-center gap-1 text-sm font-medium text-primary-foreground hover:opacity-80 transition-opacity">
            <Menu className="h-4 w-4" /> Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <Link to="/track-order" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors ml-auto">
            Track Order
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border animate-slide-in">
          <form onSubmit={handleSearch} className="p-4 sm:hidden">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-full py-2.5 pl-4 pr-12 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-muted p-2">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
          <div className="pb-4">
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted">
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm text-foreground hover:bg-muted"
              >
                {cat.name}
              </Link>
            ))}
            <div className="border-t border-border mt-2 pt-2">
              <Link to="/track-order" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm text-foreground hover:bg-muted">
                Track Order
              </Link>
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm text-foreground hover:bg-muted">
                Wishlist
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
