// app/property/[id]/page.tsx
import Link from 'next/link';  // ← IMPORTANT: Must be capital L
import { properties } from '@/data/properties';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    return properties.map((property) => ({
        id: property.id.toString(),
    }));
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PropertyPage({ params }: PageProps) {
    const { id } = await params;
    const property = properties.find(p => p.id === parseInt(id));

    if (!property) {
        notFound();
    }

    return (
        <div>
            <h1>{property.title}</h1>
            <p>Property ID: {property.id}</p>
            <p>Price: {property.price}</p>
            <p>Location: {property.location}</p>
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Baths: {property.bathrooms}</p>
            <p>{property.description}</p>

            <Link href="/">← Return Home</Link>  {/* ← Capital L, href not href */}

        </div>
    );
}