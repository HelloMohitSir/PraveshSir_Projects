'use client';

// ============================================================
// HOMEPAGE — /
// • Hero banner with animated headline
// • Search bar
// • Filters sidebar (desktop) / filter bar (mobile)
// • Property grid with loading/error/empty states
// • Pagination
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Property, FilterState } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';
import PropertyCardSkeleton from '@/components/PropertyCardSkeleton';
import Filters from '@/components/Filters';
import SearchBar from '@/components/SearchBar';
import { TrendingUp, AlertCircle, SlidersHorizontal, X } from 'lucide-react';

const PAGE_SIZE = 9;

const DEFAULT_FILTERS: FilterState = {
  category: 'all',
  search:   '',
  minPrice: 0,
  maxPrice: Infinity,
  sortBy:   'newest',
};

export default function HomePage() {
  const searchParams = useSearchParams();

  const [filters,    setFilters]    = useState<FilterState>({
    ...DEFAULT_FILTERS,
    category: (searchParams.get('category') as FilterState['category']) ?? 'all',
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [page,       setPage]       = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // ── Fetch from our mock API ─────────────────────────────
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.category !== 'all') params.set('category', filters.category);
      if (filters.search)             params.set('search',   filters.search);
      if (filters.minPrice > 0)       params.set('minPrice', String(filters.minPrice));
      if (filters.maxPrice < Infinity) params.set('maxPrice', String(filters.maxPrice));
      params.set('sortBy', filters.sortBy);

      const res  = await fetch(`/api/properties?${params}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();

      setProperties(json.data);
      setTotal(json.total);
      setPage(1); // reset pagination on filter change
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  // Paginated slice
  const paginatedProps = properties.slice(0, page * PAGE_SIZE);
  const hasMore        = paginatedProps.length < properties.length;

  const heroTitles: Record<FilterState['category'], string> = {
    all:    'Find Your Perfect Place',
    rental: 'Premium Rentals',
    sale:   'Homes For Sale',
    hotel:  'Luxury Hotels',
    resort: 'World-Class Resorts',
  };

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-charcoal-900 to-charcoal-950 text-white py-20 px-4">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-700 opacity-20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-brand-500 opacity-10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" /> 24 Properties Available
          </p>
          <h1
            style={{ fontFamily: 'Playfair Display, serif' }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-up"
          >
            {heroTitles[filters.category]}
          </h1>
          <p className="text-charcoal-300 text-lg mb-10 max-w-xl mx-auto animate-fade-up stagger-2">
            Browse hand-picked rentals, homes, hotels and resorts from around the world.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto animate-fade-up stagger-3">
            <SearchBar
              value={filters.search}
              onChange={(s) => setFilters((f) => ({ ...f, search: s }))}
            />
          </div>
        </div>
      </section>

      {/* ── MAIN LAYOUT ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <p className="text-sm text-charcoal-500">
            <span className="font-bold text-charcoal-800">{total}</span> results
          </p>
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-medium"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* ── SIDEBAR (desktop) ──────────────────────────── */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <Filters
                filters={filters}
                onChange={(f) => setFilters(f)}
                totalCount={total}
              />
            </div>
          </div>

          {/* ── GRID ───────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Loading skeletons */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-charcoal-800">Something went wrong</h3>
                <p className="text-charcoal-500 text-sm">{error}</p>
                <button
                  onClick={fetchProperties}
                  className="mt-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && properties.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                <div className="text-6xl">🏚️</div>
                <h3 className="text-lg font-semibold text-charcoal-800">No properties found</h3>
                <p className="text-charcoal-500 text-sm max-w-sm">
                  Try adjusting your search or filters — there are plenty of beautiful properties waiting!
                </p>
                <button
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="mt-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Results */}
            {!loading && !error && properties.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProps.map((prop, i) => (
                    <PropertyCard key={prop.id} property={prop} index={i} />
                  ))}
                </div>

                {/* Load more / Pagination */}
                {hasMore && (
                  <div className="mt-10 text-center">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      className="px-8 py-3 bg-white border-2 border-brand-200 text-brand-700 rounded-2xl font-medium hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all duration-200"
                    >
                      Load More ({properties.length - paginatedProps.length} remaining)
                    </button>
                  </div>
                )}

                {!hasMore && properties.length > PAGE_SIZE && (
                  <p className="mt-8 text-center text-sm text-charcoal-400">
                    All {properties.length} properties shown
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER ─────────────────────────────── */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMobileFilters(false)}
          />
          {/* drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#fdf6ee] rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                Filters
              </h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 rounded-xl hover:bg-brand-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Filters
              filters={filters}
              onChange={(f) => { setFilters(f); }}
              totalCount={total}
            />
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full mt-6 py-3 bg-brand-600 text-white rounded-2xl font-medium"
            >
              Show {total} Results
            </button>
          </div>
        </div>
      )}
    </>
  );
}
