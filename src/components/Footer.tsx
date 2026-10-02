import React from 'react';
import { BRAND_STORY } from '../data/seedData';
import { MapPin, Mail, Phone, Shield } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  return (
    <footer className="bg-[#241E1A] text-[#FAF8F5] pt-16 pb-12 border-t border-[#3A322C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12 border-b border-[#3A322C]">
          
          {/* Brand Manifesto & Location */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-2xl font-serif font-bold tracking-[0.2em] uppercase text-[#FAF8F5] block">
              ÈDÁ
            </span>
            <p className="text-xs uppercase tracking-widest text-[#B5A89B] font-mono">
              {BRAND_STORY.tagline}
            </p>
            <p className="text-xs text-[#D1C7BD] leading-relaxed max-w-sm">
              {BRAND_STORY.mission} Hand-poured in small numbered batches using natural coconut-soy wax and botanical infusions.
            </p>
            
            <div className="pt-2 flex items-start gap-2 text-xs text-[#B5A89B]">
              <MapPin className="w-4 h-4 text-[#FAF8F5] flex-shrink-0 mt-0.5" />
              <span>{BRAND_STORY.address}</span>
            </div>
          </div>

          {/* Scent Collections */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#B5A89B] font-mono">
              Sanctuary Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF8F5]">
              <li>
                <button
                  onClick={() => onSelectCategory('candles')}
                  className="hover:text-[#B5A89B] transition-colors"
                >
                  Artisanal Scented Candles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('diffusers')}
                  className="hover:text-[#B5A89B] transition-colors"
                >
                  Botanical Reed Diffusers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('room_mists')}
                  className="hover:text-[#B5A89B] transition-colors"
                >
                  Room & Linen Mists
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('ceramic_vessels')}
                  className="hover:text-[#B5A89B] transition-colors"
                >
                  Wheel-Thrown Ceramic Vessels
                </button>
              </li>
            </ul>
          </div>

          {/* Concierge & Dispatch Details */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#B5A89B] font-mono">
              Lagos Atelier Concierge
            </h4>
            <p className="text-xs text-[#D1C7BD] leading-relaxed">
              We offer personalized corporate gifting and bespoke interior scent curation across Nigeria.
            </p>
            
            <div className="space-y-1.5 pt-2 text-xs text-[#FAF8F5]">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B5A89B]" />
                <a href={`mailto:${BRAND_STORY.contactEmail}`} className="hover:underline">
                  {BRAND_STORY.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B5A89B]" />
                <span>{BRAND_STORY.contactPhone}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-[#B5A89B]">
              <Shield className="w-3.5 h-3.5" />
              <span>Payments in Nigerian Naira (₦) · Verified Gateways</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Provenance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8F847A] font-mono">
          <p>© {new Date().getFullYear()} ÈDÁ Artisanal Living Nigeria Ltd. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Formulated in Lagos · Handcrafted with Pride in Nigeria</p>
        </div>

      </div>
    </footer>
  );
};
