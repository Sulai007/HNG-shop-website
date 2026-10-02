import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { formatNaira } from '../utils/formatters';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (p: Product) => void;
  formatPrice?: (amount: number) => string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = query.trim() === ''
    ? products.slice(0, 4)
    : products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-20"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, sneakers, hoodies, electronics..."
            className="flex-1 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-gray-400 hover:text-black font-semibold"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-black rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
            {query.trim() === '' ? 'Popular Trending Searches' : `Results for "${query}" (${results.length})`}
          </p>

          {results.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-xs">
              No products found matching "{query}". Try searching for "hoodie", "watch", or "air max".
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="p-3 bg-gray-50/80 hover:bg-orange-50/60 rounded-xl flex items-center justify-between cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-gray-100"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#EA580C] transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-gray-500">{product.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs sm:text-sm font-extrabold text-gray-950 font-mono">
                    {formatNaira(product.price)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#EA580C] transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
