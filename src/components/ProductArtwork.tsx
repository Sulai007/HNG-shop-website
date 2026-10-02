import React from 'react';

interface ProductArtworkProps {
  category: 'candles' | 'diffusers' | 'room_mists' | 'ceramic_vessels';
  name: string;
  className?: string;
  aspectRatio?: '4/3' | '1/1' | '16/9';
}

export const ProductArtwork: React.FC<ProductArtworkProps> = ({
  category,
  name,
  className = '',
  aspectRatio = '4/3',
}) => {
  // Bespoke artisanal Nigerian illustrations for each physical product category
  const renderCategoryArtwork = () => {
    switch (category) {
      case 'candles':
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="terracottaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4A3B32" />
                <stop offset="50%" stopColor="#352922" />
                <stop offset="100%" stopColor="#1E1713" />
              </linearGradient>
              <linearGradient id="waxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F5EFE6" />
                <stop offset="100%" stopColor="#E6DDCF" />
              </linearGradient>
              <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#EA580C" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#78350F" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Background pedestal surface */}
            <ellipse cx="200" cy="245" rx="140" ry="24" fill="#000000" fillOpacity="0.08" />
            <ellipse cx="200" cy="240" rx="120" ry="18" fill="#E8E2D8" />
            
            {/* Ceramic Candle Jar */}
            <path d="M125 125 C125 110, 275 110, 275 125 L265 220 C265 235, 135 235, 135 220 Z" fill="url(#terracottaGrad)" />
            {/* Wax surface */}
            <ellipse cx="200" cy="125" rx="72" ry="14" fill="url(#waxGrad)" stroke="#3A2D25" strokeWidth="2" />
            {/* Inner rim */}
            <ellipse cx="200" cy="125" rx="68" ry="11" fill="#FAF5EE" />
            
            {/* Wick */}
            <line x1="200" y1="125" x2="200" y2="105" stroke="#2C241E" strokeWidth="3" strokeLinecap="round" />
            
            {/* Soft flame glow */}
            <circle cx="200" cy="95" r="28" fill="url(#flameGlow)" />
            {/* Flame */}
            <path d="M200 82 C196 90, 193 96, 196 102 C198 106, 202 106, 204 102 C207 96, 204 90, 200 82 Z" fill="#FCD34D" />
            <path d="M200 88 C198 93, 196 97, 198 101 C199 103, 201 103, 202 101 C204 97, 202 93, 200 88 Z" fill="#F97316" />

            {/* Minimalist studio label */}
            <rect x="160" y="160" width="80" height="36" rx="2" fill="#FAF8F5" stroke="#E6E0D6" strokeWidth="1" />
            <text x="200" y="176" textAnchor="middle" fill="#2C241E" fontSize="9" fontFamily="serif" letterSpacing="2">ÈDÁ</text>
            <text x="200" y="187" textAnchor="middle" fill="#786B60" fontSize="6" fontFamily="sans-serif" letterSpacing="1">LAGOS · 240G</text>
          </svg>
        );

      case 'diffusers':
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="amberGlass" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#78350F" stopOpacity="0.9" />
                <stop offset="30%" stopColor="#B45309" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#92400E" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#451A03" stopOpacity="0.95" />
              </linearGradient>
            </defs>
            {/* Shadow */}
            <ellipse cx="200" cy="245" rx="100" ry="16" fill="#000000" fillOpacity="0.07" />
            
            {/* Reeds */}
            <line x1="200" y1="140" x2="165" y2="45" stroke="#1E1713" strokeWidth="3" strokeLinecap="round" />
            <line x1="200" y1="140" x2="185" y2="35" stroke="#2C241E" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="200" y1="140" x2="202" y2="30" stroke="#1E1713" strokeWidth="3" strokeLinecap="round" />
            <line x1="200" y1="140" x2="218" y2="38" stroke="#3A2E26" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="200" y1="140" x2="238" y2="48" stroke="#1E1713" strokeWidth="3" strokeLinecap="round" />

            {/* Diffuser Vessel */}
            <rect x="186" y="125" width="28" height="15" rx="2" fill="#2C241E" />
            <path d="M155 140 L245 140 L240 235 C240 240, 160 240, 160 235 Z" fill="url(#amberGlass)" />
            {/* Liquid highlight */}
            <rect x="163" y="165" width="74" height="65" rx="4" fill="#D97706" fillOpacity="0.15" />
            
            {/* Label */}
            <rect x="168" y="170" width="64" height="42" rx="1" fill="#FAF8F5" />
            <text x="200" y="188" textAnchor="middle" fill="#2C241E" fontSize="9" fontFamily="serif" letterSpacing="1.5">ÈDÁ</text>
            <text x="200" y="198" textAnchor="middle" fill="#695E54" fontSize="5.5" fontFamily="sans-serif" letterSpacing="1">REED DIFFUSER</text>
            <text x="200" y="206" textAnchor="middle" fill="#A89B8F" fontSize="4.5" fontFamily="sans-serif">200ML · BOTANICAL</text>
          </svg>
        );

      case 'room_mists':
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="frostedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ECE6DE" />
                <stop offset="50%" stopColor="#F5F0E9" />
                <stop offset="100%" stopColor="#DFD8CF" />
              </linearGradient>
              <linearGradient id="brassCap" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A16207" />
                <stop offset="40%" stopColor="#CA8A04" />
                <stop offset="80%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#854D0E" />
              </linearGradient>
            </defs>
            {/* Shadow */}
            <ellipse cx="200" cy="245" rx="85" ry="14" fill="#000000" fillOpacity="0.08" />
            
            {/* Atomizer nozzle */}
            <rect x="194" y="60" width="12" height="15" rx="1" fill="url(#brassCap)" />
            <rect x="188" y="75" width="24" height="12" rx="1" fill="url(#brassCap)" />
            <rect x="180" y="87" width="40" height="28" rx="2" fill="url(#brassCap)" />
            
            {/* Spray Bottle Body */}
            <rect x="160" y="115" width="80" height="125" rx="6" fill="url(#frostedGrad)" stroke="#D4CBC0" strokeWidth="1" />
            
            {/* Typographic Label */}
            <rect x="168" y="145" width="64" height="60" rx="1" fill="#FFFFFF" stroke="#E6E0D6" strokeWidth="0.5" />
            <text x="200" y="165" textAnchor="middle" fill="#2C241E" fontSize="9" fontFamily="serif" letterSpacing="2">ÈDÁ</text>
            <text x="200" y="177" textAnchor="middle" fill="#786B60" fontSize="5.5" fontFamily="sans-serif" letterSpacing="1">ROOM & LINEN</text>
            <text x="200" y="188" textAnchor="middle" fill="#2C241E" fontSize="6" fontFamily="serif" fontStyle="italic">Solitude</text>
            <text x="200" y="198" textAnchor="middle" fill="#998C80" fontSize="5" fontFamily="sans-serif">150ML</text>
          </svg>
        );

      case 'ceramic_vessels':
      default:
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="vesselGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C48B68" />
                <stop offset="100%" stopColor="#8C4A26" />
              </linearGradient>
              <linearGradient id="vesselGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3F3934" />
                <stop offset="100%" stopColor="#211D1A" />
              </linearGradient>
            </defs>
            <ellipse cx="200" cy="245" rx="130" ry="20" fill="#000000" fillOpacity="0.08" />
            
            {/* Vessel 1: Tall Charcoal */}
            <path d="M140 100 C130 150, 120 210, 140 230 C160 235, 180 235, 190 230 C200 210, 190 150, 180 100 Z" fill="url(#vesselGrad2)" />
            <ellipse cx="160" cy="100" rx="20" ry="5" fill="#1C1816" stroke="#4A443E" />
            
            {/* Vessel 2: Low Terracotta Bowl */}
            <path d="M190 155 C175 190, 175 225, 200 235 C235 240, 275 240, 290 235 C305 220, 295 190, 280 155 Z" fill="url(#vesselGrad1)" />
            <ellipse cx="235" cy="155" rx="45" ry="10" fill="#E6A883" stroke="#8C4A26" />
            <ellipse cx="235" cy="155" rx="40" ry="8" fill="#693318" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-[#F4EFEA] flex items-center justify-center select-none ${className}`}
      style={{ aspectRatio: aspectRatio === '4/3' ? '4 / 3' : aspectRatio === '16/9' ? '16 / 9' : '1 / 1' }}
      aria-label={name}
    >
      {/* Subtle organic texture dots */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#2C241E_1px,transparent_1px)] [background-size:16px_16px]" />
      
      {/* Category Artwork */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4 transition-transform duration-500 ease-out hover:scale-105">
        {renderCategoryArtwork()}
      </div>

      {/* Nigerian Craft Stamp */}
      <div className="absolute bottom-3 left-3 text-[10px] tracking-wider text-[#7A6F65] uppercase font-mono font-medium pointer-events-none">
        Lagos, NG
      </div>
    </div>
  );
};
