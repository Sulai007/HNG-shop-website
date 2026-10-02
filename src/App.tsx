import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderHistoryView } from './components/OrderHistoryView';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { productService } from './services/productService';
import { Product, Order } from './types';
import { Search, SlidersHorizontal, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

function StorefrontContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc'>('featured');
  
  // Navigation / Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentView, setCurrentView] = useState<'store' | 'checkout' | 'account'>('store');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    async function loadCatalogue() {
      setLoading(true);
      try {
        const data = await productService.getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load catalogue:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalogue();
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
        const matchesSearch =
          searchQuery.trim() === '' ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, activeCategory, searchQuery, sortBy]);

  const categories = [
    { id: 'all', label: 'All Sanctuary Pieces' },
    { id: 'candles', label: 'Artisanal Candles' },
    { id: 'diffusers', label: 'Reed Diffusers' },
    { id: 'room_mists', label: 'Room Mists' },
    { id: 'ceramic_vessels', label: 'Ceramic Vessels' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1B18] flex flex-col font-sans">
      
      {/* 3-Zone Navigation Header */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (currentView !== 'store') setCurrentView('store');
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAccount={() => setCurrentView('account')}
      />

      {/* Main Body Routing */}
      <main className="flex-1">
        {currentView === 'store' && (
          <>
            {/* Hero Section */}
            <Hero
              onExploreClick={() => {
                const el = document.getElementById('catalogue-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Product Catalogue Section */}
            <section id="catalogue-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              
              {/* Section Header & Subtitle */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E8E2D8]">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#786B60] font-mono">
                    Artisanal Formulary · Lagos Atelier
                  </span>
                  <h2 className="mt-1 text-3xl sm:text-4xl font-serif font-semibold text-[#1E1B18]">
                    The Sanctuary Collection
                  </h2>
                </div>

                {/* Filter and Discovery Controls (Segmented Tabs & Search) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6F65]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search botanicals, notes..."
                      className="pl-9 pr-3 py-2 text-xs bg-[#FFFFFF] border border-[#D9D2C7] focus:outline-none focus:border-[#2C241E] w-full sm:w-56"
                    />
                  </div>

                  {/* Sort Selector */}
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="py-2 px-3 text-xs bg-[#FFFFFF] border border-[#D9D2C7] text-[#2C241E] focus:outline-none focus:border-[#2C241E]"
                  >
                    <option value="featured">Featured First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Category Segmented Tabs (Compliant with Frontend Design button tab rules) */}
              <div className="flex items-center gap-2 overflow-x-auto py-6 scrollbar-none border-b border-[#E8E2D8]">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors border ${
                      activeCategory === cat.id
                        ? 'bg-[#2C241E] text-[#FAF8F5] border-[#2C241E]'
                        : 'bg-[#FFFFFF] text-[#594E45] border-[#E8E2D8] hover:border-[#8C8075]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Product Grid */}
              <div className="pt-10">
                {loading ? (
                  <div className="py-24 text-center space-y-3">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#2C241E]" />
                    <p className="font-mono text-xs text-[#7A6F65]">Curating artisanal batches from Lagos...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="py-20 text-center space-y-3 bg-[#FFFFFF] border border-[#E8E2D8] p-8">
                    <p className="font-serif text-lg text-[#2C241E]">No sanctuary pieces match your search</p>
                    <p className="text-xs text-[#7A6F65]">Try selecting another category or clearing your query.</p>
                    <button
                      onClick={() => {
                        setActiveCategory('all');
                        setSearchQuery('');
                      }}
                      className="mt-3 px-6 py-2 bg-[#2C241E] text-[#FAF8F5] text-xs uppercase font-mono tracking-wider"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelect={(p) => setSelectedProduct(p)}
                      />
                    ))}
                  </div>
                )}
              </div>

            </section>

            {/* Atelier Provenance & Craft Story Section */}
            <section className="bg-[#EDE6DC] py-20 border-t border-[#E8E2D8]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto text-center space-y-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#786B60]">
                    Our Philosophy · ÌLÉ & ẸRÚ
                  </span>
                  <h3 className="text-3xl font-serif font-semibold text-[#1E1B18]">
                    Rooted in West African Botanical Heritage
                  </h3>
                  <p className="text-sm text-[#594E45] leading-relaxed">
                    Every candle vessel is either hand-thrown by master ceramists in Edo State or cast in weighted raw stoneware. We blend non-toxic coconut wax with indigenous plant extracts, cured vanilla orchids, and sacred resin woods.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Checkout Page */}
        {currentView === 'checkout' && (
          <CheckoutView
            onBackToShopping={() => setCurrentView('store')}
            onOrderCompleted={(newOrder) => {
              setConfirmedOrder(newOrder);
              setCurrentView('store');
            }}
          />
        )}

        {/* Order History / Account View */}
        {currentView === 'account' && (
          <OrderHistoryView
            onBackToShopping={() => setCurrentView('store')}
            onOpenOrderConfirmation={(order) => setConfirmedOrder(order)}
          />
        )}
      </main>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        allProducts={products}
        onClose={() => setSelectedProduct(null)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setCurrentView('checkout')}
        onExploreProducts={() => {
          if (currentView !== 'store') setCurrentView('store');
          const el = document.getElementById('catalogue-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onViewOrderHistory={() => {
          setConfirmedOrder(null);
          setCurrentView('account');
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Editorial Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (currentView !== 'store') setCurrentView('store');
          const el = document.getElementById('catalogue-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <StorefrontContent />
      </CartProvider>
    </AuthProvider>
  );
}
