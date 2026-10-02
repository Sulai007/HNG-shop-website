import React, { useState } from 'react';
import { ArrowRight, Mail, Phone, MapPin, ShieldCheck, Check } from 'lucide-react';
import { CATEGORIES } from '../data/seedData';

interface FooterProps {
  onSelectCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer id="footer" className="bg-[#0F1115] text-white pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter Strip */}
        <div className="pb-12 border-b border-gray-800/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-1">
            <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white">
              Stay in the Loop
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-md lg:ml-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 bg-white/10 border border-gray-700 rounded-lg px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#EA580C]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <>
                    <span>Join</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 border-b border-gray-800/80">
          
          {/* Brand Info */}
          <div className="col-span-2 lg:col-span-4 space-y-4">
            <a href="/" className="text-2xl font-extrabold tracking-tight font-heading flex items-center">
              <span>Nova</span>
              <span className="text-[#EA580C]">Trend</span>
            </a>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Discover products you'll love. Curating the latest trending apparel, tech audio, smart wearables, and lifestyle gear worldwide.
            </p>
            <div className="space-y-1.5 text-xs text-gray-400 pt-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span>14B Admiralty Way, Lekki Phase 1, Lagos & New York Hub</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span>support@novatrend.store</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span>+234 (0) 812 345 6789 / +1 (800) 555-NOVA</span>
              </p>
            </div>
          </div>

          {/* Shop Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.name)}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name} Collection
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#hero" className="hover:text-white transition-colors">Track Your Order</a></li>
              <li><a href="#hero" className="hover:text-white transition-colors">Shipping & Delivery</a></li>
              <li><a href="#hero" className="hover:text-white transition-colors">30-Day Returns</a></li>
              <li><a href="#hero" className="hover:text-white transition-colors">FAQ & Support</a></li>
              <li><a href="#hero" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div className="col-span-2 lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              100% Secure Shopping
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every checkout is protected with 256-bit SSL encryption. We support Visa, Mastercard, Verve, and Bank Transfer with instant receipt generation.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Authentic Merchandise Guarantee</span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Payment Methods */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-mono gap-4">
          <p>© {new Date().getFullYear()} NovaTrend Inc. All rights reserved.</p>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>VISA</span>
            <span>·</span>
            <span>MASTERCARD</span>
            <span>·</span>
            <span>VERVE</span>
            <span>·</span>
            <span>PAYSTACK</span>
            <span>·</span>
            <span>APPLE PAY</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
