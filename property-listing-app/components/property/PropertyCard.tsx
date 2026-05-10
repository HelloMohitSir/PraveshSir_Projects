import Link from "next/link";

export default function PropertyCard({
  property,
}: any) {
  return (
    <Link href={`/property/${property.id}`}>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">

        <img
          src={property.image}
          alt={property.title}
          className="h-60 w-full object-cover"
        />

        <div className="p-4">
          <h2 className="text-xl font-semibold">
            {property.title}
          </h2>

          <p className="text-gray-500">
            {property.location}
          </p>

          <p className="text-blue-600 font-bold">
            ${property.price}
          </p>
        </div>

      </div>
    </Link>
  );
}