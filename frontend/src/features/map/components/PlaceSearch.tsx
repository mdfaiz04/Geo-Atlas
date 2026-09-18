// Search box that finds a place by name and hands it to the map to fly to.
import { useId, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { usePlaceSearch } from '@/features/map/hooks/usePlaceSearch';
import type { Place } from '@/features/map/types';
import '@/features/map/components/PlaceSearch.css';

interface PlaceSearchProps {
  onSelect: (place: Place) => void;
}

export function PlaceSearch({ onSelect }: PlaceSearchProps) {
  const listId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const places = usePlaceSearch(query).data ?? [];
  const showResults = open && places.length > 0;

  function choose(place: Place): void {
    onSelect(place);
    setQuery(place.name);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setOpen(true);
        setActiveIndex((index) => Math.min(index + 1, places.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case 'Enter': {
        const place = places[activeIndex] ?? places[0];
        if (place !== undefined) {
          event.preventDefault();
          choose(place);
        }
        break;
      }
      case 'Escape':
        setOpen(false);
        break;
      default:
        break;
    }
  }

  return (
    <div className="place-search">
      <input
        type="search"
        className="place-search__input"
        placeholder="Search for a place…"
        role="combobox"
        aria-label="Search for a place"
        aria-autocomplete="list"
        aria-expanded={showResults}
        aria-controls={listId}
        aria-activedescendant={
          showResults && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
        }
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={handleKeyDown}
      />
      {showResults ? (
        <ul className="place-search__results" id={listId} role="listbox">
          {places.map((place, index) => (
            <li
              key={place.id}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className="place-search__option"
              onMouseDown={(event) => {
                event.preventDefault();
                choose(place);
              }}
            >
              <span className="place-search__name">{place.name}</span>
              <span className="place-search__context">{place.context}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
