'use client';

// ============================================================
// PROPERTY DETAIL PAGE — /property/[id]
// Shows full info: gallery, specs, amenities, map placeholder
// ============================================================

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, Star, MapPin, Bed, Bath, Maximize2,
  Heart, Share2, Check, Phone, Mail,
} from 'lucide-react';
import { Property } from '@/types/property';
import { formatPrice } from '@/lib/data';

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [property,    setProperty]    = useState<Property | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [activeImg,   setActiveImg]   = useState(0);
  const [wishlisted,  setWishlisted]  = useState(false);
  const [shareMsg,    setShareMsg]    = useState('');

  // Fetch single property
  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch(`/api/properties/${params.id}`);
        if (!res.ok) throw new Error('Property not found');
        const json = await res.json();
        setProperty(json.data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error loading property');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id]);

  // Sync wishlist
  useEffect(() => {
    if (!property) return;
    try {
      const saved = localStorage.getItem('nestquest-wishlist');
      const list: string[] = saved ? JSON.parse(saved) : [];
      setWishlisted(list.includes(property.id));
    } catch { /* ignore */ }
  }, [property]);

  const toggleWishlist = () => {
    if (!property) return;
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
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch { /* ignore */ }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareMsg('Link copied!');
      setTimeout(() => setShareMsg(''), 2000);
    } catch { /* ignore */ }
  };

  // ── Loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-6">
        <div className="h-8 skeleton w-32" />
        <div className="h-96 skeleton rounded-3xl" />
        <div className="h-6 skeleton w-3/4" />
        <div className="h-4 skeleton w-1/2" />
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────
  if (error || !property) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-32 text-center">
        <div className="text-6xl mb-4">🏚️</div>
        <h2 className="text-2xl font-semibold mb-2">Property Not Found</h2>
        <p className="text-charcoal-500 mb-6">{error}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-2xl font-medium hover:bg-brand-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Listings
        </Link>
      </div>
    );
  }

  const CATEGORY_COLORS: Record<string, string> = {
    rental: 'bg-blue-100 text-blue-800',
    sale:   'bg-green-100 text-green-800',
    hotel:  'bg-purple-100 text-purple-800',
    resort: 'bg-brand-100 text-brand-800',
  };

  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ── Back ─────────────────────────────────────────── */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-charcoal-500 hover:text-brand-600 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to listings
      </Link>

      {/* ── Gallery ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-8">
        {/* Hero image */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden h-72 md:h-[420px] img-zoom">
          <Image
            src={property.images[activeImg] ?? property.image}
            alt={property.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
        </div>

        {/* Thumbs */}
        <div className="flex lg:flex-col gap-3">
          {property.images.slice(1, 4).map((src, i) => (
            <button
              key={src}
              onClick={() => setActiveImg(i + 1)}
              className={`relative flex-1 lg:flex-none lg:h-[130px] rounded-2xl overflow-hidden img-zoom border-2 transition-all ${
                activeImg === i + 1 ? 'border-brand-600' : 'border-transparent hover:border-brand-300'
              }`}
            >
              <Image src={src} alt={`View ${i + 2}`} fill className="object-cover" sizes="25vw" />
            </button>
          ))}
          {/* fallback if <3 extra images */}
          {property.images.length < 2 && (
            <button
              onClick={() => setActiveImg(0)}
              className={`relative flex-1 lg:flex-none lg:h-[130px] rounded-2xl overflow-hidden border-2 ${
                activeImg === 0 ? 'border-brand-600' : 'border-transparent hover:border-brand-300'
              }`}
            >
              <Image src={property.image} alt="Main" fill className="object-cover" sizes="25vw" />
            </button>
          )}
        </div>
      </div>

      {/* ── Detail grid ──────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-10">
        {/* ── Left: Info ─────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[property.category]}`}>
                {property.category === 'sale' ? 'For Sale' : property.category.charAt(0).toUpperCase() + property.category.slice(1)}
              </span>
              {property.featured && (
                <span className="text-xs font-bold bg-brand-600 text-white px-2.5 py-1 rounded-full">
                  ⭐ Featured
                </span>
              )}
            </div>

            <h1
              style={{ fontFamily: 'Playfair Display, serif' }}
              className="text-3xl md:text-4xl font-bold text-charcoal-950 leading-tight mb-3"
            >
              {property.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-charcoal-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-500" />
                {property.location} · {property.city}, {property.country}
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-brand-500 text-brand-500" />
                <strong className="text-charcoal-800">{property.rating}</strong>
                &nbsp;({property.reviews} reviews)
              </span>
            </div>
          </div>

          {/* Specs row */}
          <div className="flex flex-wrap gap-4 py-5 border-y border-brand-100">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center">
                  <Bed className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-charcoal-800">{property.bedrooms}</p>
                  <p className="text-charcoal-400 text-xs">Bedrooms</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center">
                <Bath className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <p className="font-semibold text-charcoal-800">{property.bathrooms}</p>
                <p className="text-charcoal-400 text-xs">Bathrooms</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center">
                <Maximize2 className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <p className="font-semibold text-charcoal-800">{property.area.toLocaleString()} ft²</p>
                <p className="text-charcoal-400 text-xs">Floor Area</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-xl font-semibold mb-3">
              About This Property
            </h2>
            <p className="text-charcoal-600 leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-xl font-semibold mb-4">
              What&rsquo;s Included
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map((a) => (
                <div key={a} className="flex items-center gap-2 text-sm text-charcoal-700">
                  <div className="w-5 h-5 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-brand-700" />
                  </div>
                  {a}
                </div>
              ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-xl font-semibold mb-3">
              Location
            </h2>
            <div className="h-56 rounded-3xl bg-gradient-to-br from-charcoal-100 to-brand-100 flex items-center justify-center text-charcoal-400 border border-brand-100">
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-brand-400" />
                <p className="text-sm">{property.city}, {property.country}</p>
                <p className="text-xs mt-1 text-charcoal-300">Map integration goes here (Google Maps / Mapbox)</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Price card ──────────────────────────── */}
        <div>
          <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-xl border border-brand-100 space-y-5">
            <div>
              <p
                style={{ fontFamily: 'Playfair Display, serif' }}
                className="text-3xl font-bold text-brand-600"
              >
                {formatPrice(property)}
              </p>
              {property.priceUnit && (
                <p className="text-sm text-charcoal-400 mt-0.5">{property.priceUnit}</p>
              )}
            </div>

            {/* CTA */}
            <button className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white rounded-2xl font-semibold transition-all duration-200 shadow-md">
              {property.category === 'sale'   ? 'Request a Tour'  :
               property.category === 'rental' ? 'Schedule Viewing' :
               'Book Now'}
            </button>

            <button
              onClick={toggleWishlist}
              className={`w-full py-3 rounded-2xl font-medium border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                wishlisted
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'border-brand-200 text-brand-700 hover:bg-brand-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
              {wishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="w-full py-3 rounded-2xl font-medium border-2 border-charcoal-200 text-charcoal-600 hover:bg-charcoal-50 transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              {shareMsg || 'Share Property'}
            </button>

            {/* Contact info */}
            <div className="border-t border-brand-100 pt-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-400">
                Contact Agent
              </p>
              <a
                href="tel:+15555555555"
                className="flex items-center gap-3 text-sm text-charcoal-700 hover:text-brand-600 transition-colors"
              >
                <div className="w-8 h-8 bg-brand-50 rounded-xl flex items-center justify-center">
                  <Phone className="w-4 h-4 text-brand-600" />
                </div>
                +1 (555) 555-5555
              </a>
              <a
                href="mailto:agent@nestquest.com"
                className="flex items-center gap-3 text-sm text-charcoal-700 hover:text-brand-600 transition-colors"
              >
                <div className="w-8 h-8 bg-brand-50 rounded-xl flex items-center justify-center">
                  <Mail className="w-4 h-4 text-brand-600" />
                </div>
                agent@nestquest.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
