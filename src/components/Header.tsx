import React, { useState } from 'react';
import { Search, Heart, User as UserIcon, ShoppingBag, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, BRAND_STORY } from '../data/seedData';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenAccount: () => void;
  onSelectCategory: (category: string) => void;
  activeCategory: string;
  onOpenSearch: () => void;
  currency: 'USD' | 'NGN';
  onToggleCurrency: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  onOpenAccount,
  onSelectCategory,
  activeCategory,
  onOpenSearch,
  currency,
  onToggleCurrency,
  wishlistCount,
  onOpenWishlist,
}) => {
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', id: 'home', target: 'hero' },
    { label: 'Shop', id: 'all', target: 'categories' },
    { label: 'New Arrivals', id: 'new_arrivals', target: 'new_arrivals' },
    { label: 'Best Sellers', id: 'best_sellers', target: 'best_sellers' },
    { label: 'About', id: 'about', target: 'footer' },
    { label: 'Blog', id: 'blog', target: 'footer' },
    { label: 'Contact', id: 'contact', target: 'footer' },
  ];

  const handleNavClick = (link: { label: string; id: string; target: string }) => {
    if (link.id === 'all') {
      onSelectCategory('all');
    }
    const element = document.getElementById(link.target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-xs">
      {/* 1. Top Black Announcement Banner (Exact match to image) */}
      <div className="bg-[#0F1115] text-white text-[11px] sm:text-xs py-2 px-4 font-sans tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-center overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-center gap-3 sm:gap-6 mx-auto whitespace-nowrap text-gray-300">
            <span className="flex items-center gap-1.5">
              <span>🚚</span>
              <span>Free Shipping Across Nigeria Over ₦50,000</span>
            </span>
            <span className="text-gray-600 hidden sm:inline">|</span>
            <span className="flex items-center gap-1.5 text-white font-medium">
              <span>🔥</span>
              <span>Summer Sale Up To 70% Off</span>
            </span>
            <span className="text-gray-600 hidden md:inline">|</span>
            <span className="flex items-center gap-1.5 text-amber-400 hidden md:inline-flex">
              <span>⚡</span>
              <span>Limited Time Flash Deals</span>
            </span>
          </div>

          {/* Quick Currency Selector */}
          <button
            onClick={onToggleCurrency}
            className="hidden lg:flex items-center gap-1 px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[11px] font-mono text-white transition-colors"
            title="Toggle between USD ($) and Nigerian Naira (₦)"
          >
            <span>{currency === 'USD' ? '$ USD' : '₦ NGN'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-black focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950 font-heading flex items-center"
          >
            <span>Nova</span>
            <span className="text-[#EA580C]">Trend</span>
          </a>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium text-gray-700">
          <button
            onClick={() => handleNavClick({ label: 'Home', id: 'home', target: 'hero' })}
            className="relative py-1 text-gray-950 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#EA580C] after:rounded-full"
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick({ label: 'Shop', id: 'all', target: 'categories' })}
            className="py-1 hover:text-gray-950 transition-colors"
          >
            Shop
          </button>

          <button
            onClick={() => handleNavClick({ label: 'New Arrivals', id: 'new_arrivals', target: 'new_arrivals' })}
            className="py-1 hover:text-gray-950 transition-colors"
          >
            New Arrivals
          </button>

          <button
            onClick={() => handleNavClick({ label: 'Best Sellers', id: 'best_sellers', target: 'best_sellers' })}
            className="py-1 hover:text-gray-950 transition-colors"
          >
            Best Sellers
          </button>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              onBlur={() => setTimeout(() => setCategoryDropdownOpen(false), 200)}
              className="py-1 flex items-center gap-1 hover:text-gray-950 transition-colors"
            >
              <span>Categories</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {categoryDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.name);
                      setCategoryDropdownOpen(false);
                      const el = document.getElementById('new_arrivals');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-orange-50 hover:text-[#EA580C] transition-colors flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">({cat.itemCount})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavClick({ label: 'About', id: 'about', target: 'footer' })}
            className="py-1 hover:text-gray-950 transition-colors"
          >
            About
          </button>

          <button
            onClick={() => handleNavClick({ label: 'Blog', id: 'blog', target: 'footer' })}
            className="py-1 hover:text-gray-950 transition-colors"
          >
            Blog
          </button>

          <button
            onClick={() => handleNavClick({ label: 'Contact', id: 'contact', target: 'footer' })}
            className="py-1 hover:text-gray-950 transition-colors"
          >
            Contact
          </button>
        </nav>

        {/* Right Icon Actions: Search, Wishlist, User, Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Toggle on Tablet/Mobile */}
          <button
            onClick={onToggleCurrency}
            className="lg:hidden px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[11px] font-mono font-medium text-gray-800"
          >
            {currency === 'USD' ? '$' : '₦'}
          </button>

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Search products"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="w-4.5 h-4.5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* User Account Button */}
          {user ? (
            <button
              onClick={onOpenAccount}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              title="Account & Orders"
            >
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-7 h-7 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                  {user.full_name.charAt(0)}
                </div>
              )}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Sign in"
            >
              <UserIcon className="w-4.5 h-4.5" />
            </button>
          )}

          {/* Cart Bag with Circle Badge */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative p-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={`Shopping bag with ${itemCount} items`}
          >
            <ShoppingBag className="w-5 h-5 text-gray-900" />
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#EA580C] text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
              {itemCount}
            </span>
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[110px] z-50 bg-white border-b border-gray-200 px-6 py-6 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Navigation</span>
              <button
                onClick={onToggleCurrency}
                className="px-2.5 py-1 bg-gray-100 rounded text-xs font-mono font-medium text-gray-800"
              >
                Switch Currency: {currency === 'USD' ? '$ USD' : '₦ NGN'}
              </button>
            </div>

            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link)}
                className="w-full text-left text-base font-medium py-1.5 text-gray-800 hover:text-[#EA580C] flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-gray-400">→</span>
              </button>
            ))}

            <div className="pt-4 border-t border-gray-100 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Shop Categories</span>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCategory(c.name);
                      setMobileMenuOpen(false);
                      const el = document.getElementById('new_arrivals');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2.5 bg-gray-50 hover:bg-orange-50 rounded-lg text-xs font-medium text-gray-800 text-left transition-colors"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              {user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAccount();
                  }}
                  className="w-full py-3 bg-gray-900 text-white rounded-lg text-xs font-semibold"
                >
                  My Account ({user.full_name})
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full py-3 bg-[#EA580C] text-white rounded-lg text-xs font-semibold"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
