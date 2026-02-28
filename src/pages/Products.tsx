import React, { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SlidersHorizontal, Grid3X3, LayoutList, X } from "lucide-react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const priceRanges = [
  { label: "Under ₹5,000", min: 0, max: 5000 },
  { label: "₹5,000 - ₹15,000", min: 5000, max: 15000 },
  { label: "₹15,000 - ₹30,000", min: 15000, max: 30000 },
  { label: "₹30,000 - ₹50,000", min: 30000, max: 50000 },
  { label: "Above ₹50,000", min: 50000, max: Infinity },
];

const materials = ["Fabric", "Particleboard", "Solid wood", "Oak veneer", "Solid pine", "Particleboard, Steel"];
const colors = ["Grey", "Oak", "Oak veneer", "Yellow", "Natural", "Oak effect", "White/Oak", "Light brown"];
const sortOptions = [
  { label: "Popularity", value: "popular" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
  { label: "Newest First", value: "newest" },
];

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);

  // Sync category filter when URL params change (e.g. clicking nav links)
  React.useEffect(() => {
    setSelectedCategory(categoryFilter);
  }, [categoryFilter]);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.subcategory.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      result = result.filter((p) => p.price >= range.min && p.price < range.max);
    }
    if (selectedMaterial) result = result.filter((p) => p.material === selectedMaterial);
    if (selectedColor) result = result.filter((p) => p.color === selectedColor);

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "newest": result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    }

    return result;
  }, [selectedCategory, selectedPriceRange, selectedMaterial, selectedColor, sortBy, searchQuery]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedPriceRange(null);
    setSelectedMaterial("");
    setSelectedColor("");
  };

  const hasFilters = selectedCategory || selectedPriceRange !== null || selectedMaterial || selectedColor;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-muted border-b border-border">
        <div className="ikea-container py-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">
            {selectedCategory ? categories.find((c) => c.id === selectedCategory)?.name : "All Products"}
          </span>
          {searchQuery && <span className="text-foreground">— "{searchQuery}"</span>}
        </div>
      </div>

      <div className="ikea-container py-6">
        {/* Title & sort */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {selectedCategory ? categories.find((c) => c.id === selectedCategory)?.name : "All Products"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{filteredProducts.length} products</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 border border-border rounded text-sm font-medium hover:bg-muted transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-border rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filters */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">
                {categories.find((c) => c.id === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory("")}><X className="h-3 w-3" /></button>
              </span>
            )}
            {selectedPriceRange !== null && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">
                {priceRanges[selectedPriceRange].label}
                <button onClick={() => setSelectedPriceRange(null)}><X className="h-3 w-3" /></button>
              </span>
            )}
            {selectedMaterial && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">
                {selectedMaterial}
                <button onClick={() => setSelectedMaterial("")}><X className="h-3 w-3" /></button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-destructive hover:underline">Clear all</button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className={`${showFilters ? "block fixed inset-0 z-50 bg-background p-4 overflow-y-auto" : "hidden"} lg:block lg:static lg:w-56 flex-shrink-0`}>
            {showFilters && (
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h2 className="font-bold text-lg">Filters</h2>
                <button onClick={() => setShowFilters(false)}><X className="h-5 w-5" /></button>
              </div>
            )}

            {/* Category */}
            <div className="mb-6">
              <h3 className="font-semibold text-sm mb-3 text-foreground">Category</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`block text-sm w-full text-left py-1 ${!selectedCategory ? "font-bold text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`block text-sm w-full text-left py-1 ${selectedCategory === cat.id ? "font-bold text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {cat.name} ({products.filter((p) => p.category === cat.id).length})
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <h3 className="font-semibold text-sm mb-3 text-foreground">Price</h3>
              <div className="space-y-2">
                {priceRanges.map((range, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)}
                    className={`block text-sm w-full text-left py-1 ${selectedPriceRange === i ? "font-bold text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div className="mb-6">
              <h3 className="font-semibold text-sm mb-3 text-foreground">Material</h3>
              <div className="space-y-2">
                {materials.map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setSelectedMaterial(selectedMaterial === mat ? "" : mat)}
                    className={`block text-sm w-full text-left py-1 ${selectedMaterial === mat ? "font-bold text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            {showFilters && (
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-primary text-primary-foreground font-bold py-3 rounded mt-4 lg:hidden"
              >
                Show {filteredProducts.length} results
              </button>
            )}
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg font-medium text-foreground mb-2">No products found</p>
                <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or search query.</p>
                <button onClick={clearFilters} className="text-sm font-medium text-primary hover:underline">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;
