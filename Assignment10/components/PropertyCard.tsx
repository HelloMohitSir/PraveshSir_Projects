'use client';

// ============================================================
// PROPERTY CARD — reusable card shown in the grid
// Displays image, badge, title, location, price, rating
// Includes wishlist toggle via localStorage
// ============================================================

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Heart, Star, MapPin, Bed, Bath, Maximize2 } from 'lucide-react';
import { Property } from '@/types/property';
import { formatPrice } from '@/lib/data';

interface Props {
  property: Property;
  index?: number; // for stagger animation
}

const CATEGORY_STYLES: Record<string, string> = {
  rental: 'bg-blue-100   text-blue-800',
  sale:   'bg-green-100  text-green-800',
  hotel:  'bg-purple-100 text-purple-800',
  resort: 'bg-brand-100  text-brand-800',
};

const CATEGORY_LABELS: Record<string, string> = {
  rental: 'For Rent',
  sale:   'For Sale',
  hotel:  'Hotel',
  resort: 'Resort',
};

export default function PropertyCard({ property, index = 0 }: Props) {
  const [wishlisted, setWishlisted] = useState(false);

  // Read wishlist state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nestquest-wishlist');
      const list: string[] = saved ? JSON.parse(saved) : [];
      setWishlisted(list.includes(property.id));
    } catch { /* ignore */ }
  }, [property.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent card navigation
    try {
      const saved = localStorage.getItem('nestquest-wishlist');
      let list: string[] = saved ? JSON.parse(saved) : [];

      if (list.includes(property.id)) {
        list = list.filter((id) => id !== property.id);
      } else {
        list.push(property.id);
      }

      localStorage.setItem('nestquest-wishlist', JSON.stringify(list));
      setWishlisted(!wishlisted);

      // Notify Header to update count badge
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch { /* ignore */ }
  };

  const staggerClass = `stagger-${Math.min(index + 1, 6)}`;

  return (
    <Link href={`/property/${property.id}`} className="block group">
      <article
        className={`bg-white rounded-2xl overflow-hidden card-hover animate-fade-up ${staggerClass} border border-brand-100`}
      >
        {/* ── Image ──────────────────────────────────────── */}
        <div className="relative h-52 overflow-hidden img-zoom">
          <Image
            src={property.image}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={index < 3}
          />

          {/* Category badge */}
          <span
            className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
              CATEGORY_STYLES[property.category]
            }`}
          >
            {CATEGORY_LABELS[property.category]}
          </span>

          {/* Wishlist button */}
          <button
            onClick={toggleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-200 ${
              wishlisted
                ? 'bg-red-500 text-white scale-110'
                : 'bg-white text-charcoal-500 hover:text-red-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Featured ribbon */}
          {property.featured && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-brand-600 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* ── Content ────────────────────────────────────── */}
        <div className="p-4">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-brand-500 text-brand-500" />
            <span className="text-sm font-semibold text-charcoal-700">{property.rating}</span>
            <span className="text-xs text-charcoal-400">({property.reviews} reviews)</span>
          </div>

          {/* Title */}
          <h3
            style={{ fontFamily: 'Playfair Display, serif' }}
            className="font-semibold text-charcoal-950 text-base leading-snug mb-1.5 group-hover:text-brand-600 transition-colors line-clamp-2"
          >
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-charcoal-500 text-sm mb-3">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-3 text-xs text-charcoal-400 mb-4 border-t border-brand-50 pt-3">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5" />
                {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" />
              {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5" />
              {property.area.toLocaleString()} ft²
            </span>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between">
            <div>
              <span
                className="text-xl font-bold text-brand-600"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {formatPrice(property)}
              </span>
              {property.category === 'sale' && (
                <p className="text-[11px] text-charcoal-400 mt-0.5">Listed price</p>
              )}
            </div>
            <span className="text-xs text-brand-600 font-medium bg-brand-50 px-2 py-1 rounded-lg group-hover:bg-brand-600 group-hover:text-white transition-colors">
              View →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
