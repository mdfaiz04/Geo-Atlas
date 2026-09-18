# A site boundary as a validated GeoJSON polygon in longitude and latitude.
from collections.abc import Sequence
from dataclasses import dataclass
from typing import Any

from src.domain.exceptions import InvalidGeometryError

Position = tuple[float, float]
Ring = tuple[Position, ...]

MIN_RING_POSITIONS = 4
MAX_TOTAL_POSITIONS = 5000


# Checks one longitude and latitude pair actually lies on the planet.
def parse_position(position: Sequence[float]) -> Position:
    if len(position) < 2:
        raise InvalidGeometryError("every point needs a longitude and a latitude")
    longitude, latitude = float(position[0]), float(position[1])
    if not -180 <= longitude <= 180:
        raise InvalidGeometryError(f"longitude {longitude} is outside -180 to 180")
    if not -90 <= latitude <= 90:
        raise InvalidGeometryError(f"latitude {latitude} is outside -90 to 90")
    return longitude, latitude


# Checks a ring has enough points and closes back on where it started.
def parse_ring(ring: Sequence[Sequence[float]]) -> Ring:
    if len(ring) < MIN_RING_POSITIONS:
        raise InvalidGeometryError(f"each ring needs at least {MIN_RING_POSITIONS} points")
    positions = tuple(parse_position(position) for position in ring)
    if positions[0] != positions[-1]:
        raise InvalidGeometryError("each ring must end where it starts")
    return positions


@dataclass(frozen=True, slots=True)
class Polygon:
    rings: tuple[Ring, ...]

    @classmethod
    def from_coordinates(cls, coordinates: Sequence[Sequence[Sequence[float]]]) -> "Polygon":
        if len(coordinates) == 0:
            raise InvalidGeometryError("a polygon needs an outer ring")
        rings = tuple(parse_ring(ring) for ring in coordinates)
        if sum(len(ring) for ring in rings) > MAX_TOTAL_POSITIONS:
            raise InvalidGeometryError(f"a boundary can have at most {MAX_TOTAL_POSITIONS} points")
        return cls(rings)

    def to_geojson(self) -> dict[str, Any]:
        return {
            "type": "Polygon",
            "coordinates": [[list(position) for position in ring] for ring in self.rings],
        }
