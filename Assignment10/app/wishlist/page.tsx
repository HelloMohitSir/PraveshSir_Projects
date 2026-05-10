'use client';

// ============================================================
// WISHLIST PAGE — /wishlist
// Shows all properties the user has hearted
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';
import { Property } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';

export default function WishlistPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = localStorage.getItem('nestquest-wishlist');
        const ids: string[] = saved ? JSON.parse(saved) : [];

        if (ids.length === 0) { setLoading(false); return; }

        const res  = await fetch('/api/properties');
        const json = await res.json();
        const all: Property[] = json.data;

        setProperties(all.filter((p) => ids.includes(p.id)));
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-charcoal-500 hover:text-brand-600 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to listings
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
        </div>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-charcoal-950">
            Your Wishlist
          </h1>
          {!loading && (
            <p className="text-sm text-charcoal-500">
              {properties.length === 0
                ? 'No saved properties yet'
                : `${properties.length} saved ${properties.length === 1 ? 'property' : 'properties'}`}
            </p>
          )}
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
            <div key={i} className="h-80 skeleton rounded-2xl" />
          ))}
        </div>
      )}

      {!loading && properties.length === 0 && (
        <div className="text-center py-24">
          <div className="text-7xl mb-4">💔</div>
          <h2 className="text-xl font-semibold mb-2">Nothing saved yet</h2>
          <p className="text-charcoal-500 mb-6 text-sm">
            Click the heart on any property card to save it here.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-2xl font-medium hover:bg-brand-700 transition-colors"
          >
            Browse Properties
          </Link>
        </div>
      )}

      {!loading && properties.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
