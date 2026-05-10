// ============================================================
// MOCK API — /api/properties
// Next.js Route Handler (App Router)
// Supports query params: category, search, minPrice, maxPrice, sortBy
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { properties } from '@/lib/data';
import { Category } from '@/types/property';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const category  = searchParams.get('category') as Category | 'all' | null;
  const search    = searchParams.get('search')?.toLowerCase() ?? '';
  const minPrice  = Number(searchParams.get('minPrice') ?? 0);
  const maxPrice  = Number(searchParams.get('maxPrice') ?? Infinity);
  const sortBy    = searchParams.get('sortBy') ?? 'newest';

  let result = [...properties];

  // ── Filter by category ────────────────────────────────
  if (category && category !== 'all') {
    result = result.filter((p) => p.category === category);
  }

  // ── Filter by search (title, city, country, location) ─
  if (search) {
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.city.toLowerCase().includes(search) ||
        p.country.toLowerCase().includes(search) ||
        p.location.toLowerCase().includes(search)
    );
  }

  // ── Filter by price range ─────────────────────────────
  result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);

  // ── Sort ──────────────────────────────────────────────
  switch (sortBy) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    default:
      // 'newest' → keep original insertion order (already sorted)
      break;
  }

  // Simulate network delay (remove in production)
  await new Promise((r) => setTimeout(r, 200));

  return NextResponse.json({ data: result, total: result.length });
}
