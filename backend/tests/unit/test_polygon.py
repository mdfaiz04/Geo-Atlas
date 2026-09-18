# Checks the boundary rules a site polygon must satisfy before it reaches the database.
import pytest

from src.domain.exceptions import InvalidGeometryError
from src.domain.value_objects.polygon import MAX_TOTAL_POSITIONS, Polygon

SQUARE = [[[77.0, 28.0], [77.01, 28.0], [77.01, 28.01], [77.0, 28.01], [77.0, 28.0]]]


def test_accepts_a_closed_square() -> None:
    polygon = Polygon.from_coordinates(SQUARE)

    assert polygon.rings[0][0] == (77.0, 28.0)
    assert len(polygon.rings[0]) == 5


def test_accepts_a_polygon_with_a_hole() -> None:
    hole = [[77.002, 28.002], [77.004, 28.002], [77.004, 28.004], [77.002, 28.002]]

    polygon = Polygon.from_coordinates([SQUARE[0], hole])

    assert len(polygon.rings) == 2


def test_round_trips_to_geojson() -> None:
    geojson = Polygon.from_coordinates(SQUARE).to_geojson()

    assert geojson == {"type": "Polygon", "coordinates": SQUARE}


@pytest.mark.parametrize(
    ("coordinates", "message"),
    [
        ([], "outer ring"),
        ([[[77.0, 28.0], [77.01, 28.0], [77.0, 28.0]]], "at least 4 points"),
        ([[[77.0, 28.0], [77.01, 28.0], [77.01, 28.01], [77.0, 28.01]]], "end where it starts"),
        ([[[190.0, 28.0], [77.01, 28.0], [77.01, 28.01], [190.0, 28.0]]], "longitude"),
        ([[[77.0, 95.0], [77.01, 28.0], [77.01, 28.01], [77.0, 95.0]]], "latitude"),
        ([[[77.0], [77.01, 28.0], [77.01, 28.01], [77.0]]], "longitude and a latitude"),
    ],
)
def test_rejects_malformed_boundaries(coordinates: list, message: str) -> None:
    with pytest.raises(InvalidGeometryError, match=message):
        Polygon.from_coordinates(coordinates)


def test_rejects_boundaries_with_too_many_points() -> None:
    ring = [[77.0 + index * 1e-6, 28.0] for index in range(MAX_TOTAL_POSITIONS)]
    ring.append(ring[0])

    with pytest.raises(InvalidGeometryError, match="at most"):
        Polygon.from_coordinates([ring])
