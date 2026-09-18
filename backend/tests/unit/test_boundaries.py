# Checks generated demo boundaries are closed, repeatable and roughly the requested size.
import math

from src.cli.boundaries import KM_PER_DEGREE_LATITUDE, VERTEX_COUNT, boundary_around


def test_boundary_is_a_closed_ring() -> None:
    ring = boundary_around(77.15, 28.40, 1.2, "Mangar Bani Buffer").rings[0]

    assert len(ring) == VERTEX_COUNT + 1
    assert ring[0] == ring[-1]


def test_the_same_seed_draws_the_same_boundary() -> None:
    first = boundary_around(77.15, 28.40, 1.2, "Mangar Bani Buffer")

    assert first == boundary_around(77.15, 28.40, 1.2, "Mangar Bani Buffer")
    assert first != boundary_around(77.15, 28.40, 1.2, "Damdama Ridge")


def test_every_corner_sits_near_the_requested_radius() -> None:
    ring = boundary_around(77.15, 28.40, 1.2, "Mangar Bani Buffer").rings[0]
    km_per_degree_longitude = 111.320 * math.cos(math.radians(28.40))

    for longitude, latitude in ring:
        distance = math.hypot(
            (longitude - 77.15) * km_per_degree_longitude,
            (latitude - 28.40) * KM_PER_DEGREE_LATITUDE,
        )
        assert 0.8 <= distance <= 1.5
