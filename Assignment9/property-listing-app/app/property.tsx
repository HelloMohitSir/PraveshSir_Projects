// app/property/[id]/page.tsx
import { properties } from '@/data/properties';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Generate static paths for all properties
export async function generateStaticParams() {
  return properties.map((property) => ({
    id: property.id.toString(),
  }));
}

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const property = properties.find(p => p.id === parseInt(id));
  
  if (!property) {
    notFound();
  }
  
  return (
    <div>
      <Link href="/">← Back to Home</Link>
      
      <h1>{property.title}</h1>
      
      {/* Add more property details here */}
      <p>Property ID: {property.id}</p>
      
      <footer>© 2026 PropertyHub</footer>
    </div>
  );
}