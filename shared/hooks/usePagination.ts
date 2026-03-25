// usePagination — hook reutilizabil pentru paginarea unei liste de elemente.
// Gestioneaza pagina curenta, marimea paginii si slicing-ul listei.
// Folosit in EncyclopediaScreen, PlantSelector si orice alt loc cu paginare.

import { useState, useMemo, useEffect, useRef } from 'react';

interface UsePaginationResult<T> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  paginatedItems: T[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function usePagination<T>(
  items: T[],
  initialPageSize = 10,
): UsePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Resetare la pagina 1 cand lista de items se schimba (ex: search/filtrare)
  const prevItemsRef = useRef(items);
  useEffect(() => {
    if (prevItemsRef.current !== items) {
      setCurrentPage(1);
      prevItemsRef.current = items;
    }
  }, [items]);

  const totalPages = Math.ceil(items.length / pageSize);
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));

  const paginatedItems = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize],
  );

  const onPageChange = (page: number) => setCurrentPage(page);

  const onPageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    currentPage: safePage,
    pageSize,
    totalPages,
    paginatedItems,
    onPageChange,
    onPageSizeChange,
  };
}
