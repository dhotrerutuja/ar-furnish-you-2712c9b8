import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, RotateCcw, Star } from "lucide-react";
import heroLivingRoom from "@/assets/hero-living-room.jpg";
import heroBedroom from "@/assets/hero-bedroom.jpg";
import ProductCard from "@/components/products/ProductCard";
import { products, categories, formatPrice } from "@/data/products";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Index = () => {
  const featuredProducts = products.filter((p) => p.isBestseller).slice(0, 4);
  const newProducts = products.filter((p) => p.isNew);
  const saleProducts = products.filter((p) => p.originalPrice);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh]">
          <img
            src={heroLivingRoom}
            alt="Modern Scandinavian living room"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-foreground/20" />
          <div className="relative h-full ikea-container flex items-center">
            <div className="max-w-lg">
              <span className="inline-block bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded mb-4">
                NEW COLLECTION 2026
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-background leading-tight mb-4">
                Create your perfect home
              </h1>
              <p className="text-background/80 text-lg mb-6">
                Discover affordable, well-designed furniture for every room. Free delivery on orders above ₹5,000.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-bold px-6 py-3 rounded-full hover:brightness-95 transition-all"
                >
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/products?category=sofas"
                  className="inline-flex items-center gap-2 bg-background/20 backdrop-blur-sm text-background font-medium px-6 py-3 rounded-full hover:bg-background/30 transition-all border border-background/30"
                >
                  Explore Sofas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="bg-muted border-y border-border">
        <div className="ikea-container py-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Truck, label: "Free Delivery", desc: "On orders above ₹5,000" },
              { icon: Shield, label: "Secure Payment", desc: "UPI, Cards, Net Banking" },
              { icon: RotateCcw, label: "Easy Returns", desc: "14-day return policy" },
              { icon: Star, label: "Quality Guaranteed", desc: "Designed to last" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="ikea-container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Shop by Room</h2>
          <Link to="/products" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="group relative rounded overflow-hidden aspect-square"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-sm font-bold text-background">{cat.name}</h3>
                <p className="text-xs text-background/70">{cat.productCount} items</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-muted py-12">
        <div className="ikea-container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Bestsellers</h2>
            <Link to="/products" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="relative overflow-hidden">
        <div className="relative h-[40vh]">
          <img
            src={heroBedroom}
            alt="Modern bedroom"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-foreground/70 to-foreground/20" />
          <div className="relative h-full ikea-container flex items-center justify-end">
            <div className="max-w-md text-right">
              <h2 className="text-3xl sm:text-4xl font-black text-background mb-3">
                Sleep better tonight
              </h2>
              <p className="text-background/80 mb-4">
                Explore our bedroom collection — from beds and mattresses to nightstands and wardrobes.
              </p>
              <Link
                to="/products?category=beds"
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-bold px-6 py-3 rounded-full hover:brightness-95 transition-all"
              >
                Shop Bedroom <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="ikea-container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">New Arrivals</h2>
          <Link to="/products" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {saleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-primary py-12">
        <div className="ikea-container text-center">
          <h2 className="text-2xl font-bold text-primary-foreground mb-2">Join VirtualHome Family</h2>
          <p className="text-primary-foreground/70 mb-6 max-w-md mx-auto">
            Get exclusive offers, design inspiration, and free delivery on your first order.
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button className="bg-secondary text-secondary-foreground font-bold px-6 py-3 rounded-full hover:brightness-95 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
