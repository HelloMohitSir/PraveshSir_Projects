'use client';

// ============================================================
// SEARCH BAR — text input that triggers filtering
// Uses debounce so we don't fire on every keystroke
// ============================================================

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  const [local, setLocal] = useState(value);

  // Debounce: wait 350ms after typing stops before calling onChange
  useEffect(() => {
    const timer = setTimeout(() => onChange(local), 350);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local]);

  return (
    <div className="relative group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400 group-focus-within:text-brand-600 transition-colors" />
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="Search by city, country, or property name…"
        className="w-full pl-12 pr-10 py-3.5 rounded-2xl border-2 border-brand-100 bg-white text-charcoal-800 placeholder-charcoal-300 text-sm focus:outline-none focus:border-brand-500 transition-all duration-200 shadow-sm"
      />
      {local && (
        <button
          onClick={() => { setLocal(''); onChange(''); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
