// Searches for places as the user types, waiting for a pause so each keystroke is not a request.
import { useQuery } from '@tanstack/react-query';
import { searchPlaces } from '@/features/map/api/geocodingApi';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';

const TYPING_PAUSE_MS = 300;
const MINIMUM_QUERY_LENGTH = 2;
const RESULTS_STAY_FRESH_MS = 5 * 60 * 1000;

export function usePlaceSearch(query: string) {
  const settledQuery = useDebouncedValue(query.trim(), TYPING_PAUSE_MS);

  return useQuery({
    queryKey: ['places', settledQuery],
    queryFn: ({ signal }) => searchPlaces(settledQuery, signal),
    enabled: settledQuery.length >= MINIMUM_QUERY_LENGTH,
    staleTime: RESULTS_STAY_FRESH_MS,
  });
}
