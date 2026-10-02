import React from 'react';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Headphones, Star } from 'lucide-react';
import { Product } from '../types';
import { formatNaira } from '../utils/formatters';

interface HeroProps {
  onShopNowClick: () => void;
  onExploreClick: () => void;
  onSelectProduct: (product: Product) => void;
  currency?: 'USD' | 'NGN';
  formatPrice?: (amount: number) => string;
  floatingProducts: {
    sneaker: Product;
    headphones: Product;
    smartwatch: Product;
    bottle: Product;
  };
}

export const Hero: React.FC<HeroProps> = ({
  onShopNowClick,
  onExploreClick,
  onSelectProduct,
  currency,
  formatPrice,
  floatingProducts,
}) => {
  return (
    <section id="hero" className="relative overflow-hidden bg-[#FBFBFB] pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          
          {/* Left Column: Headline, Subtitle, Buttons, Avatars */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-7 z-10">
            
            {/* Tagline */}
            <div className="inline-flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] bg-orange-50 px-3 py-1 rounded-full">
                TRENDING NOW
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-gray-950 font-heading tracking-tight leading-[1.12]">
              Discover Products <br />
              <span className="text-gray-950">You'll Love</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 max-w-md leading-relaxed font-normal">
              Shop the latest trending products curated for modern lifestyles.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onShopNowClick}
                className="px-7 py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold text-sm rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreClick}
                className="px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm rounded-lg border border-gray-200 transition-colors shadow-2xs cursor-pointer active:scale-98"
              >
                Explore Collection
              </button>
            </div>

            {/* Social Proof */}
            <div className="pt-2 flex items-center gap-3">
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Customer"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Customer"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="Customer"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                  alt="Customer"
                />
              </div>

              <div className="text-xs text-gray-600 font-medium">
                <div className="flex items-center text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span>Loved by 50,000+ customers worldwide</span>
              </div>
            </div>

          </div>

          {/* Right Column: Large Lifestyle Model with 4 Floating Product Cards */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[460px] sm:min-h-[520px]">
            
            {/* Background Designer Red Chair / Organic Glow Circle */}
            <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-[36px] bg-gradient-to-tr from-[#EA3829]/90 via-[#F95738]/85 to-[#FF7043]/80 p-2 shadow-2xl flex items-center justify-center overflow-visible">
              
              {/* Central Fashion Model (White Nike Crewneck Sweatshirt) */}
              <div className="relative w-full h-full rounded-[30px] overflow-hidden bg-[#E2E8F0]">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
                  alt="NovaTrend Fashion Model in White Sweatshirt"
                  className="w-full h-full object-cover object-top scale-105"
                  loading="eager"
                />
              </div>

              {/* FLOATING CARD 1: Air Max 270 (Top Left) */}
              {floatingProducts.sneaker && (
                <div
                  onClick={() => onSelectProduct(floatingProducts.sneaker)}
                  className="absolute -top-3 left-4 sm:left-6 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl border border-white/60 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform z-20"
                >
                  <img
                    src={floatingProducts.sneaker.image_url}
                    alt={floatingProducts.sneaker.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-lg bg-gray-50"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-tight">
                      {floatingProducts.sneaker.name}
                    </h4>
                    <p className="text-xs font-extrabold text-[#EA580C] mt-0.5 font-mono">
                      {formatNaira(floatingProducts.sneaker.price)}
                    </p>
                  </div>
                </div>
              )}

              {/* FLOATING CARD 2: Wireless Headphones (Center Left) */}
              {floatingProducts.headphones && (
                <div
                  onClick={() => onSelectProduct(floatingProducts.headphones)}
                  className="absolute top-1/2 -translate-y-8 -left-3 sm:-left-8 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl border border-white/60 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform z-20"
                >
                  <img
                    src={floatingProducts.headphones.image_url}
                    alt={floatingProducts.headphones.name}
                    className="w-11 h-11 sm:w-13 sm:h-13 object-contain rounded-lg bg-gray-50"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-tight">
                      {floatingProducts.headphones.name}
                    </h4>
                    <p className="text-xs font-extrabold text-[#EA580C] mt-0.5 font-mono">
                      {formatNaira(floatingProducts.headphones.price)}
                    </p>
                  </div>
                </div>
              )}

              {/* FLOATING CARD 3: Smart Watch Series 9 (Top Right) */}
              {floatingProducts.smartwatch && (
                <div
                  onClick={() => onSelectProduct(floatingProducts.smartwatch)}
                  className="absolute top-4 -right-2 sm:-right-6 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl border border-white/60 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform z-20"
                >
                  <img
                    src={floatingProducts.smartwatch.image_url}
                    alt={floatingProducts.smartwatch.name}
                    className="w-11 h-11 sm:w-13 sm:h-13 object-contain rounded-lg bg-gray-50"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-tight">
                      Smart Watch
                    </h4>
                    <p className="text-xs font-extrabold text-[#EA580C] mt-0.5 font-mono">
                      {formatNaira(floatingProducts.smartwatch.price)}
                    </p>
                  </div>
                </div>
              )}

              {/* FLOATING CARD 4: Water Bottle (Bottom Right) */}
              {floatingProducts.bottle && (
                <div
                  onClick={() => onSelectProduct(floatingProducts.bottle)}
                  className="absolute bottom-10 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl border border-white/60 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform z-20"
                >
                  <img
                    src={floatingProducts.bottle.image_url}
                    alt={floatingProducts.bottle.name}
                    className="w-11 h-11 sm:w-13 sm:h-13 object-contain rounded-lg bg-gray-50"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-tight">
                      Water Bottle
                    </h4>
                    <p className="text-xs font-extrabold text-[#EA580C] mt-0.5 font-mono">
                      {formatNaira(floatingProducts.bottle.price)}
                    </p>
                  </div>
                </div>
              )}

              {/* Pagination Dots (matching screenshot) */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white ring-1 ring-gray-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/60" />
              </div>

            </div>

          </div>

        </div>

        {/* 4-Feature Trust Bar (Exact replica of row below hero) */}
        <div className="mt-14 pt-8 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 flex-shrink-0">
              <Truck className="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Free Shipping</h4>
              <p className="text-[11px] sm:text-xs text-gray-500">On orders over ₦50,000</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Secure Payments</h4>
              <p className="text-[11px] sm:text-xs text-gray-500">100% secure checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Easy Returns</h4>
              <p className="text-[11px] sm:text-xs text-gray-500">30-day return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 flex-shrink-0">
              <Headphones className="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">24/7 Support</h4>
              <p className="text-[11px] sm:text-xs text-gray-500">Always here to help</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
