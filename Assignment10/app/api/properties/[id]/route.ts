// ============================================================
// MOCK API — /api/properties/[id]
// Returns a single property by ID
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { properties } from '@/lib/data';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const property = properties.find((p) => p.id === params.id);

  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  await new Promise((r) => setTimeout(r, 150));
  return NextResponse.json({ data: property });
}
