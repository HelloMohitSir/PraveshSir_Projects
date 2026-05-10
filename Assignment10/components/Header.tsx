'use client';

// ============================================================
// HEADER — Site-wide navigation bar
// Shows branding/logo, nav links, and wishlist icon
// ============================================================

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Heart, Menu, X, Home } from 'lucide-react';

export default function Header() {
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [scrolled,      setScrolled]      = useState(false);

  // Track scroll for header shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sync wishlist count from localStorage
  useEffect(() => {
    const sync = () => {
      try {
        const saved = localStorage.getItem('nestquest-wishlist');
        const list = saved ? JSON.parse(saved) : [];
        setWishlistCount(list.length);
      } catch { /* ignore */ }
    };
    sync();
    window.addEventListener('wishlist-updated', sync);
    return () => window.removeEventListener('wishlist-updated', sync);
  }, []);

  const navLinks = [
    { href: '/?category=rental', label: 'Rentals' },
    { href: '/?category=sale',   label: 'For Sale' },
    { href: '/?category=hotel',  label: 'Hotels' },
    { href: '/?category=resort', label: 'Resorts' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 bg-[#fdf6ee] transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ─────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span
              style={{ fontFamily: 'Playfair Display, serif' }}
              className="text-xl font-bold text-charcoal-950 tracking-tight group-hover:text-brand-600 transition-colors"
            >
              NestQuest
            </span>
          </Link>

          {/* ── Desktop Nav ──────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-charcoal-600 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* ── Actions ──────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <Link
              href="/wishlist"
              className="relative p-2 rounded-xl hover:bg-brand-50 transition-colors text-charcoal-700 hover:text-brand-600"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-brand-50 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ──────────────────────────────────── */}
        {menuOpen && (
          <div className="md:hidden border-t border-brand-100 py-3 space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
