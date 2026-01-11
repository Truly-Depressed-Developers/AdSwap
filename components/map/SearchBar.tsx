'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FilterPanel } from './FilterPanel';
import type { FilterState } from '../../hooks/useAdspaceFilters';
import { Input } from '../ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../ui/input-group';
import { FadersHorizontalIcon, XIcon } from '@phosphor-icons/react';

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
          <InputGroup className="bg-background h-12">
            <InputGroupInput
              type="text"
              placeholder="Szukaj..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className='h-12'
            />

            {searchValue && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  onClick={() => {
                    setSearchValue('');
                  }}
                >
                  <XIcon size={14} />
                </InputGroupButton>
              </InputGroupAddon>
            )}

            <InputGroupAddon align="inline-end">
              <InputGroupButton
                onClick={() => setFiltersOpen(!filtersOpen)}
                variant={activeFiltersCount > 0 ? 'default' : 'ghost'}
              >
                <FadersHorizontalIcon size={16} />
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
