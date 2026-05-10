'use client';

// ============================================================
// FILTERS — Category tabs + Price range + Sort
// Calls onChange whenever the user adjusts a filter
// ============================================================

import { FilterState, Category } from '@/types/property';
import { SlidersHorizontal } from 'lucide-react';

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalCount: number;
}

const CATEGORIES: { value: FilterState['category']; label: string; emoji: string }[] = [
  { value: 'all',    label: 'All',      emoji: '🏠' },
  { value: 'rental', label: 'Rentals',  emoji: '🔑' },
  { value: 'sale',   label: 'For Sale', emoji: '🏡' },
  { value: 'hotel',  label: 'Hotels',   emoji: '🏨' },
  { value: 'resort', label: 'Resorts',  emoji: '🌴' },
];

const SORT_OPTIONS: { value: FilterState['sortBy']; label: string }[] = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Highest Rated' },
];

export default function Filters({ filters, onChange, totalCount }: Props) {
  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <aside className="w-full space-y-6">
      {/* ── Category Tabs (scrollable on mobile) ─────────── */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-charcoal-400 mb-3">
          Category
        </h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => set('category', cat.value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                filters.category === cat.value
                  ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                  : 'bg-white text-charcoal-600 border-brand-100 hover:border-brand-400 hover:text-brand-600'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sort ─────────────────────────────────────────── */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-widest text-charcoal-400 mb-3 block">
          <SlidersHorizontal className="inline w-3.5 h-3.5 mr-1.5" />
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => set('sortBy', e.target.value as FilterState['sortBy'])}
          className="w-full rounded-xl border border-brand-100 bg-white px-3 py-2.5 text-sm text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-brand-400 transition"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Price Range ───────────────────────────────────── */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-charcoal-400 mb-3">
          Max Price
        </h2>
        <input
          type="range"
          min={0}
          max={5000000}
          step={100}
          value={filters.maxPrice === Infinity ? 5000000 : filters.maxPrice}
          onChange={(e) =>
            set('maxPrice', Number(e.target.value) >= 5000000 ? Infinity : Number(e.target.value))
          }
          className="w-full accent-brand-600"
        />
        <div className="flex justify-between text-xs text-charcoal-400 mt-1">
          <span>$0</span>
          <span className="font-semibold text-brand-600">
            {filters.maxPrice === Infinity || filters.maxPrice >= 5000000
              ? 'Any'
              : `$${Number(filters.maxPrice).toLocaleString()}`}
          </span>
          <span>$5M+</span>
        </div>
      </div>

      {/* ── Result count ─────────────────────────────────── */}
      <p className="text-sm text-charcoal-500 pt-2 border-t border-brand-100">
        <span className="font-bold text-charcoal-800">{totalCount}</span>{' '}
        {totalCount === 1 ? 'property' : 'properties'} found
      </p>
    </aside>
  );
}
