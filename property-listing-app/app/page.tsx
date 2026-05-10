// app/page.tsx
import Link from 'next/link';
import { properties } from '@/data/properties';

export default function HomePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>PropertyHub</h1>
      <h2>Explore Properties</h2>

      <div>
        {properties.map((property) => (
          <div key={property.id} style={{ marginBottom: '1rem' }}>
            <Link href={`/property/${property.id}`} style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              textDecoration: 'none',
              color: '#0070f3'
            }}>
              {property.title}
            </Link>
            <p style={{ margin: '0.25rem 0 0 1rem', color: '#666' }}>
              {property.location} - {property.price}
            </p>
          </div>
        ))}
      </div>

      <hr style={{ margin: '2rem 0' }} />
      <footer>© 2026 PropertyHub</footer>
    </div>
  );
}