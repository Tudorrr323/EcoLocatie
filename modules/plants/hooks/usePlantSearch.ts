// usePlantSearch — hook pentru cautarea si filtrarea plantelor dupa nume (roman sau latin).
// Returneaza lista filtrata si functia de setare a query-ului de cautare.

import { useState, useMemo } from 'react';
import type { Plant } from '../../../shared/types/plant.types';
import { searchPlants } from '../repository/plantsRepository';

interface UsePlantSearchResult {
  query: string;
  setQuery: (q: string) => void;
  plants: Plant[];
}

export function usePlantSearch(): UsePlantSearchResult {
  const [query, setQuery] = useState('');

  const plants = useMemo(() => searchPlants(query), [query]);

  return { query, setQuery, plants };
}
