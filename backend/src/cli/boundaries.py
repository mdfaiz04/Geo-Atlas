# Draws irregular, natural-looking site boundaries around a centre point.
import math
import random

from src.domain.value_objects.polygon import Polygon

VERTEX_COUNT = 11
KM_PER_DEGREE_LATITUDE = 110.574
KM_PER_DEGREE_LONGITUDE_AT_EQUATOR = 111.320
RADIUS_JITTER = (0.72, 1.18)


# Walks once around the centre at varying distances, so the outline never crosses itself.
def boundary_around(longitude: float, latitude: float, radius_km: float, seed: str) -> Polygon:
    rng = random.Random(seed)
    km_per_degree_longitude = KM_PER_DEGREE_LONGITUDE_AT_EQUATOR * math.cos(math.radians(latitude))
    ring: list[list[float]] = []
    for index in range(VERTEX_COUNT):
        angle = 2 * math.pi * index / VERTEX_COUNT
        distance = radius_km * rng.uniform(*RADIUS_JITTER)
        ring.append(
            [
                round(longitude + distance * math.cos(angle) / km_per_degree_longitude, 6),
                round(latitude + distance * math.sin(angle) / KM_PER_DEGREE_LATITUDE, 6),
            ]
        )
    ring.append(ring[0])
    return Polygon.from_coordinates([ring])
