import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { ProductArtwork } from './ProductArtwork';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-12 pb-20 md:pt-16 md:pb-28 border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Value Narrative */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#786B60] uppercase">
              <span>Lagos, Nigeria</span>
              <span aria-hidden="true">·</span>
              <span>Artisanal Home Fragrance</span>
              <span aria-hidden="true">·</span>
              <span>Slow Luxury</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#1E1B18] tracking-tight leading-[1.12] [text-wrap:balance]">
              Sanctuary scents poured by hand in Nigeria.
            </h1>

            <p className="text-base sm:text-lg text-[#594E45] max-w-xl leading-relaxed font-normal">
              Formulated with indigenous West African botanicals, wild hibiscus (Zobo), cured vanilla, and smoky frankincense. Housed in wheel-thrown terracotta and weighted apothecary glass.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={onExploreClick}
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#2C241E] text-[#FAF8F5] text-sm font-medium tracking-wide uppercase hover:bg-[#15120F] transition-colors rounded-none"
              >
                Discover Collection
              </button>

              <div className="flex items-center gap-3 px-4 py-2 text-xs text-[#7A6F65] font-mono">
                <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                <span>Nationwide Nigerian Delivery · Same Day in Lagos</span>
              </div>
            </div>

            {/* Subtle editorial trust proof */}
            <div className="pt-6 grid grid-cols-3 gap-6 border-t border-[#E8E2D8] w-full max-w-lg">
              <div>
                <p className="text-xl font-serif font-semibold text-[#2C241E] tabular-nums">100%</p>
                <p className="text-xs text-[#7A6F65]">Natural Coconut Soy Wax</p>
              </div>
              <div>
                <p className="text-xl font-serif font-semibold text-[#2C241E] tabular-nums">60h+</p>
                <p className="text-xs text-[#7A6F65]">Clean Artisanal Burn</p>
              </div>
              <div>
                <p className="text-xl font-serif font-semibold text-[#2C241E] tabular-nums">Lagos</p>
                <p className="text-xs text-[#7A6F65]">Hand-Crafted Atelier</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none shadow-2xl rounded-sm overflow-hidden border border-[#D9D2C7]">
              <ProductArtwork
                category="candles"
                name="ÈDÁ Lagos Sanctuary Collection"
                aspectRatio="4/3"
                className="w-full bg-[#EDE6DC]"
              />

              <div className="p-6 bg-[#FFFFFF] border-t border-[#E8E2D8]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono tracking-widest text-[#7A6F65] uppercase">Featured Scent</span>
                    <h2 className="text-lg font-serif font-semibold text-[#2C241E]">Zobo & Royal Oud Candle</h2>
                  </div>
                  <span className="font-serif text-lg font-medium text-[#2C241E] tabular-nums">₦24,500</span>
                </div>
                <p className="text-xs text-[#695E54] mt-2 line-clamp-2">
                  Wild Nigerian hibiscus calyces, smoky Assam oud, and crushed clove buds in matte dark ceramic.
                </p>
              </div>
            </div>

            {/* Floating accent caption badge */}
            <div className="absolute -bottom-4 -left-4 bg-[#2C241E] text-[#FAF8F5] p-3 text-xs font-mono shadow-lg hidden sm:block">
              BATCH #26 / FRESHLY POURED
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
