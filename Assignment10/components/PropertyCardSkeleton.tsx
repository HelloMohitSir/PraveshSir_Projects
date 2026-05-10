// ============================================================
// PROPERTY CARD SKELETON — shown while data is loading
// Matches the layout of PropertyCard exactly
// ============================================================

export default function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-brand-100 animate-pulse">
      <div className="h-52 skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 skeleton w-24" />
        <div className="h-5 skeleton w-3/4" />
        <div className="h-3 skeleton w-1/2" />
        <div className="h-3 skeleton w-full" />
        <div className="h-6 skeleton w-1/3 mt-2" />
      </div>
    </div>
  );
}
