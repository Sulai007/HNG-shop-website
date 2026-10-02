import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenAccount: () => void;
  onSelectCategory: (category: string) => void;
  activeCategory: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  onOpenAccount,
  onSelectCategory,
  activeCategory,
}) => {
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'All Sanctuary', id: 'all' },
    { label: 'Candles', id: 'candles' },
    { label: 'Reed Diffusers', id: 'diffusers' },
    { label: 'Room Mists', id: 'room_mists' },
    { label: 'Ceramic Vessels', id: 'ceramic_vessels' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D8] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#2C241E] hover:text-[#000000] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => onSelectCategory('all')}
              className="text-2xl sm:text-3xl font-serif font-bold tracking-[0.2em] uppercase text-[#2C241E] hover:opacity-80 transition-opacity"
            >
              ÈDÁ
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide text-[#594E45]">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onSelectCategory(link.id);
                  const el = document.getElementById('catalogue-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`relative py-1 transition-colors whitespace-nowrap hover:text-[#2C241E] ${
                  activeCategory === link.id
                    ? 'text-[#2C241E] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#2C241E]'
                    : ''
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <button
                onClick={onOpenAccount}
                className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-[#2C241E] hover:bg-[#EFEAE2] rounded-md transition-colors whitespace-nowrap"
                title="View account and past orders"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name}
                    className="w-6 h-6 rounded-full object-cover border border-[#D9D2C7]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#2C241E] text-[#FAF8F5] flex items-center justify-center text-xs font-serif font-bold">
                    {user.full_name.charAt(0)}
                  </div>
                )}
                <span className="hidden sm:inline max-w-[120px] truncate">{user.full_name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-[#2C241E] hover:bg-[#EFEAE2] rounded-md transition-colors whitespace-nowrap"
              >
                <UserIcon className="w-4 h-4 text-[#594E45]" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2.5 text-[#2C241E] hover:bg-[#EFEAE2] rounded-md transition-colors flex items-center gap-1.5"
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5 text-[#2C241E]" />
              <span className="font-mono text-xs font-semibold tabular-nums text-[#2C241E]">
                ({itemCount})
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 z-30 bg-[#FAF8F5] border-b border-[#E8E2D8] px-6 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#8C8075] font-mono">Curated Collections</span>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onSelectCategory(link.id);
                  setMobileMenuOpen(false);
                  const el = document.getElementById('catalogue-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-left text-lg font-serif py-1 flex items-center justify-between ${
                  activeCategory === link.id ? 'text-[#2C241E] font-bold' : 'text-[#594E45]'
                }`}
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-[#A69C91]" />
              </button>
            ))}

            <div className="pt-4 border-t border-[#E8E2D8] flex items-center justify-between">
              {user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAccount();
                  }}
                  className="w-full text-center py-2.5 bg-[#2C241E] text-[#FAF8F5] rounded text-sm font-medium"
                >
                  My Account & Orders ({user.full_name})
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full text-center py-2.5 bg-[#2C241E] text-[#FAF8F5] rounded text-sm font-medium"
                >
                  Sign In with Google
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
