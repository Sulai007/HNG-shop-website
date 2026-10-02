import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Zap, ShieldCheck, HeartHandshake, Award } from 'lucide-react';

interface PromoBannersProps {
  onShopSaleClick: () => void;
  onShopCollectionClick: () => void;
}

export const PromoBanners: React.FC<PromoBannersProps> = ({
  onShopSaleClick,
  onShopCollectionClick,
}) => {
  // Live ticking countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 15,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 2-Column Split Promotional Banners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Banner 1: Left Flash Sale Banner (Orange/Red Gradient with Sneaker) */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] p-8 sm:p-10 text-white shadow-lg flex flex-col justify-between min-h-[300px] sm:min-h-[340px]">
          
          <div className="z-10 max-w-[65%] space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full inline-block">
              Flash Sale
            </span>

            <h3 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight leading-tight">
              Up To 70% Off
            </h3>

            {/* Countdown Timer */}
            <div className="flex items-center gap-2 pt-1 font-mono">
              <div className="text-center">
                <span className="text-xl sm:text-2xl font-black bg-white/20 backdrop-blur-md rounded-lg px-2.5 py-1.5 inline-block min-w-[42px]">
                  {formatNumber(timeLeft.days)}
                </span>
                <span className="text-[10px] text-white/80 block mt-1 uppercase font-sans">Days</span>
              </div>
              <span className="text-xl font-bold self-start mt-1">:</span>

              <div className="text-center">
                <span className="text-xl sm:text-2xl font-black bg-white/20 backdrop-blur-md rounded-lg px-2.5 py-1.5 inline-block min-w-[42px]">
                  {formatNumber(timeLeft.hours)}
                </span>
                <span className="text-[10px] text-white/80 block mt-1 uppercase font-sans">Hours</span>
              </div>
              <span className="text-xl font-bold self-start mt-1">:</span>

              <div className="text-center">
                <span className="text-xl sm:text-2xl font-black bg-white/20 backdrop-blur-md rounded-lg px-2.5 py-1.5 inline-block min-w-[42px]">
                  {formatNumber(timeLeft.minutes)}
                </span>
                <span className="text-[10px] text-white/80 block mt-1 uppercase font-sans">Mins</span>
              </div>
              <span className="text-xl font-bold self-start mt-1">:</span>

              <div className="text-center">
                <span className="text-xl sm:text-2xl font-black bg-white/20 backdrop-blur-md rounded-lg px-2.5 py-1.5 inline-block min-w-[42px]">
                  {formatNumber(timeLeft.seconds)}
                </span>
                <span className="text-[10px] text-white/80 block mt-1 uppercase font-sans">Secs</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onShopSaleClick}
                className="px-6 py-3 bg-white text-gray-900 hover:bg-gray-100 font-bold text-xs sm:text-sm rounded-lg transition-colors shadow-md cursor-pointer"
              >
                Shop Sale Now
              </button>
            </div>
          </div>

          {/* Floating Sneaker Graphic */}
          <div className="absolute -right-4 -bottom-4 sm:bottom-0 w-[45%] max-w-[280px] pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
              alt="Flash Sale Sneaker"
              className="w-full h-auto object-contain drop-shadow-2xl transform -rotate-12 scale-110"
            />
          </div>
        </div>

        {/* Banner 2: Right New Collection Banner (Dark Aesthetic with Fitness Model) */}
        <div className="relative rounded-3xl overflow-hidden bg-[#0F1115] p-8 sm:p-10 text-white shadow-lg flex flex-col justify-between min-h-[300px] sm:min-h-[340px]">
          
          <div className="z-10 max-w-[65%] space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-950/60 px-3 py-1 rounded-full inline-block border border-orange-800/40">
              New Collection
            </span>

            <h3 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight leading-tight">
              Summer 2026
            </h3>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
              Discover the latest trends and fresh styles designed for movement and street aesthetics.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onShopCollectionClick}
                className="px-6 py-3 bg-white text-gray-950 hover:bg-gray-100 font-bold text-xs sm:text-sm rounded-lg transition-colors shadow-md cursor-pointer"
              >
                Shop Collection
              </button>
            </div>
          </div>

          {/* Fitness Model on Right */}
          <div className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80"
              alt="Summer Collection Fitness Model"
              className="w-full h-full object-cover object-top opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F1115] via-transparent to-transparent" />
          </div>
        </div>

      </div>

      {/* Bottom 4-Column Trust Bar (Matching bottom row in screenshot) */}
      <div className="mt-14 pt-8 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 flex-shrink-0">
            <Award className="w-5 h-5 text-gray-900" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900">Premium Quality</h4>
            <p className="text-[11px] sm:text-xs text-gray-500">Made with the finest materials</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 flex-shrink-0">
            <Zap className="w-5 h-5 text-gray-900" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900">Fast Delivery</h4>
            <p className="text-[11px] sm:text-xs text-gray-500">Quick and reliable shipping</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-gray-900" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900">Secure Checkout</h4>
            <p className="text-[11px] sm:text-xs text-gray-500">Your data is protected</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 flex-shrink-0">
            <HeartHandshake className="w-5 h-5 text-gray-900" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900">Customer Satisfaction</h4>
            <p className="text-[11px] sm:text-xs text-gray-500">100% satisfaction guarantee</p>
          </div>
        </div>

      </div>

    </section>
  );
};
