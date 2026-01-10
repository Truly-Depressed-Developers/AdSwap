'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FilterPanel } from './FilterPanel';
import type { FilterState } from './useAdspaceFilters';
import { Input } from '../ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../ui/input-group';

type SearchBarProps = {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onClear: () => void;
  activeFiltersCount: number;
  className?: string;
};

export function SearchBar({
  filters,
  onFilterChange,
  onClear,
  activeFiltersCount,
  className = '',
}: SearchBarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search);

  // Sync local state with URL params
  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFilterChange('search', searchValue);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchValue, filters.search, onFilterChange]);

  return (
    <>
      <div className={`w-full flex items-center gap-2 ${className}`}>
        {/* Search input */}
        <div className="relative flex-1">
          <InputGroup className="bg-background">
            <InputGroupInput
              type="text"
              placeholder="Szukaj..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            {searchValue && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  onClick={() => {
                    console.log('dupa');
                    setSearchValue('');
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </InputGroupButton>
              </InputGroupAddon>
            )}

            <InputGroupAddon align="inline-end">
              <InputGroupButton
                onClick={() => setFiltersOpen(!filtersOpen)}
                variant={activeFiltersCount > 0 ? 'default' : 'ghost'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                {activeFiltersCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                    {activeFiltersCount}
                  </span>
                )}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <FilterPanel
          filters={filters}
          onFilterChange={onFilterChange}
          onClear={onClear}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </>
  );
}
