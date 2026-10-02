import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryShowcase } from './components/CategoryShowcase';
import { ProductCard } from './components/ProductCard';
import { BestSellersSection } from './components/BestSellersSection';
import { PromoBanners } from './components/PromoBanners';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderHistoryView } from './components/OrderHistoryView';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { productService } from './services/productService';
import { Product, Order } from './types';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { formatNaira } from './utils/formatters';

function StorefrontContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('NGN');
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());

  // Views & Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentView, setCurrentView] = useState<'store' | 'checkout' | 'account'>('store');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // New Arrivals carousel scroll ref
  const newArrivalsScrollRef = useRef<HTMLDivElement>(null);

  // Load catalog on mount and attempt auto-seed if needed
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

    // Load persisted wishlist
    try {
      const savedWishlist = localStorage.getItem('novatrend_wishlist');
      if (savedWishlist) {
        setWishlistedIds(new Set(JSON.parse(savedWishlist)));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleToggleWishlist = (product: Product) => {
    setWishlistedIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.add(product.id);
      }
      localStorage.setItem('novatrend_wishlist', JSON.stringify([...next]));
      return next;
    });
  };

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlistedIds.has(p.id));
  }, [products, wishlistedIds]);

  // Centralized Currency Price Formatter helper (Naira primary)
  const formatPrice = formatNaira;

  // Floating items for Hero (matching screenshot)
  const floatingProducts = useMemo(() => {
    const sneaker = products.find((p) => p.slug === 'air-max-270') || products[1] || products[0];
    const headphones = products.find((p) => p.slug === 'wireless-headphones') || products[2] || products[0];
    const smartwatch = products.find((p) => p.slug === 'smart-watch-series-9') || products[3] || products[0];
    const bottle = products.find((p) => p.slug === 'stainless-steel-bottle') || products[4] || products[0];
    return { sneaker, headphones, smartwatch, bottle };
  }, [products]);

  // New Arrivals products (matching screenshot)
  const newArrivals = useMemo(() => {
    const filtered = products.filter((p) => p.is_new_arrival || p.badge);
    if (activeCategory === 'all') return filtered;
    return filtered.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());
  }, [products, activeCategory]);

  const handleScrollCarousel = (direction: 'left' | 'right') => {
    if (newArrivalsScrollRef.current) {
      const { scrollLeft, clientWidth } = newArrivalsScrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      newArrivalsScrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#111827] flex flex-col font-sans">
      
      {/* Header */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (currentView !== 'store') setCurrentView('store');
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAccount={() => setCurrentView('account')}
        onOpenSearch={() => setIsSearchOpen(true)}
        currency={currency}
        onToggleCurrency={() => setCurrency((prev) => (prev === 'USD' ? 'NGN' : 'USD'))}
        wishlistCount={wishlistedIds.size}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      {/* Main Store View */}
      <main className="flex-1">
        {currentView === 'store' && (
          <>
            {/* 1. Hero Section */}
            <Hero
              onShopNowClick={() => {
                const el = document.getElementById('new_arrivals');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreClick={() => {
                const el = document.getElementById('categories');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onSelectProduct={(p) => setSelectedProduct(p)}
              currency={currency}
              formatPrice={formatPrice}
              floatingProducts={floatingProducts}
            />

            {/* 2. Shop by Categories Section */}
            <CategoryShowcase
              activeCategory={activeCategory}
              onSelectCategory={(cat) => {
                setActiveCategory(cat);
                const el = document.getElementById('new_arrivals');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 3. New Arrivals Section (Exact replica of image) */}
            <section id="new_arrivals" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100">
              
              {/* Header with Carousel Navigation Controls */}
              <div className="flex items-center justify-between mb-8 pb-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950 font-heading tracking-tight">
                    New Arrivals
                  </h2>
                  {activeCategory !== 'all' && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">Filtered by: <strong>{activeCategory}</strong></span>
                      <button
                        onClick={() => setActiveCategory('all')}
                        className="text-xs text-[#EA580C] hover:underline"
                      >
                        Reset Filter
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleScrollCarousel('left')}
                      className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors shadow-2xs"
                      aria-label="Previous items"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleScrollCarousel('right')}
                      className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors shadow-2xs"
                      aria-label="Next items"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveCategory('all')}
                    className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-black flex items-center gap-1.5 transition-colors hidden sm:flex ml-2"
                  >
                    <span>View All New Arrivals</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 6 Products Carousel / Horizontal Grid */}
              <div
                ref={newArrivalsScrollRef}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-none"
              >
                {newArrivals.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                    currency={currency}
                    formatPrice={formatPrice}
                    isWishlisted={wishlistedIds.has(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>

            </section>

            {/* 4. Best Sellers Section */}
            <BestSellersSection
              products={products}
              onSelectProduct={(p) => setSelectedProduct(p)}
              formatPrice={formatPrice}
              onViewAllClick={() => {
                const el = document.getElementById('new_arrivals');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onToggleWishlist={handleToggleWishlist}
              wishlistedIds={wishlistedIds}
            />

            {/* 5. Dual Promotional Banners & Bottom Trust Bar */}
            <PromoBanners
              onShopSaleClick={() => {
                const el = document.getElementById('new_arrivals');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onShopCollectionClick={() => {
                setActiveCategory('Fitness');
                const el = document.getElementById('new_arrivals');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </>
        )}

        {/* Checkout View */}
        {currentView === 'checkout' && (
          <CheckoutView
            onBackToShopping={() => {
              setSelectedProduct(null);
              setCurrentView('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOrderCompleted={(newOrder) => {
              setConfirmedOrder(newOrder);
              setSelectedProduct(null);
              setCurrentView('store');
            }}
            currency={currency}
            formatPrice={formatPrice}
          />
        )}

        {/* Account / Order History View */}
        {currentView === 'account' && (
          <OrderHistoryView
            onBackToShopping={() => {
              setSelectedProduct(null);
              setCurrentView('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenOrderConfirmation={(order) => setConfirmedOrder(order)}
          />
        )}
      </main>

      {/* Product Details Modal - strictly mounted only on store view */}
      {currentView === 'store' && selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          allProducts={products}
          onClose={() => setSelectedProduct(null)}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onBuyNow={() => {
            setSelectedProduct(null);
            setCurrentView('checkout');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          currency={currency}
          formatPrice={formatPrice}
          isWishlisted={wishlistedIds.has(selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => {
          setSelectedProduct(null); // Ensure product modal is cleared
          setIsSearchOpen(false);
          setIsWishlistOpen(false);
          setCurrentView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onExploreProducts={() => {
          setSelectedProduct(null);
          if (currentView !== 'store') setCurrentView('store');
          const el = document.getElementById('new_arrivals');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        currency={currency}
        formatPrice={formatPrice}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={(id) => {
          setWishlistedIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            localStorage.setItem('novatrend_wishlist', JSON.stringify([...next]));
            return next;
          });
        }}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setIsWishlistOpen(false);
        }}
        formatPrice={formatPrice}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
        formatPrice={formatPrice}
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

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (currentView !== 'store') setCurrentView('store');
          const el = document.getElementById('new_arrivals');
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
