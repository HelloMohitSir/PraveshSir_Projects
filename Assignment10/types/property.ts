// ============================================================
// TYPES — Property shape used throughout the entire app
// ============================================================

export type Category = 'rental' | 'sale' | 'hotel' | 'resort';

export interface Property {
  id: string;
  title: string;
  category: Category;
  price: number;
  priceUnit: string;      // e.g. "/night", "/month", ""
  location: string;       // Short label shown on card
  city: string;
  country: string;
  image: string;          // Hero image URL
  images: string[];       // Gallery
  bedrooms: number;
  bathrooms: number;
  area: number;           // sq ft
  rating: number;         // 0–5
  reviews: number;
  description: string;
  amenities: string[];
  featured: boolean;
}

export interface FilterState {
  category: Category | 'all';
  search: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'newest';
}
