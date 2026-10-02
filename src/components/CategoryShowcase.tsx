import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/seedData';

interface CategoryShowcaseProps {
  onSelectCategory: (category: string) => void;
  activeCategory: string;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  onSelectCategory,
  activeCategory,
}) => {
  return (
    <section id="categories" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 pb-2">
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950 font-heading tracking-tight">
          Shop by Categories
        </h2>
        <button
          onClick={() => onSelectCategory('all')}
          className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-black flex items-center gap-1.5 transition-colors"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 6 Category Cards Grid (Exact replica of image) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.name;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`group bg-white rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer shadow-2xs hover:shadow-md flex flex-col justify-between ${
                isSelected ? 'border-[#EA580C] ring-2 ring-orange-200' : 'border-gray-200/80 hover:border-gray-400'
              }`}
            >
              {/* Category Image */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Title & "Shop Now →" Link */}
              <div className="p-3.5 sm:p-4 bg-white flex flex-col justify-between">
                <h3 className="text-sm font-bold text-gray-900 leading-snug">
                  {cat.name}
                </h3>
                <div className="mt-2 flex items-center text-[11px] font-semibold text-gray-500 group-hover:text-[#EA580C] transition-colors">
                  <span>Shop Now</span>
                  <ArrowRight className="w-3 h-3 ml-1 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
