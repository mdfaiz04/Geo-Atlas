# Checks the simulated monitoring feed is repeatable, realistic and shaped by the seasons.
from datetime import UTC, date, datetime
from decimal import Decimal
from statistics import mean
from uuid import UUID

from src.domain.entities.project import ProjectType
from src.domain.entities.site import Site
from src.domain.entities.site_metric import MetricReading, MetricType
from src.domain.value_objects.polygon import Polygon
from src.infrastructure.analytics.simulated_metrics_source import (
    HISTORY_MONTHS,
    SimulatedMetricsSource,
)

UNTIL = date(2026, 9, 18)
BOUNDARY = Polygon.from_coordinates(
    [[[77.0, 28.0], [77.01, 28.0], [77.01, 28.01], [77.0, 28.01], [77.0, 28.0]]]
)


# Builds a site whose identity seeds the simulation.
def site(number: int) -> Site:
    return Site(
        id=UUID(int=number),
        project_id=UUID(int=0),
        name="Simulated site",
        boundary=BOUNDARY,
        area_hectares=Decimal("100"),
        created_at=datetime(2026, 9, 18, tzinfo=UTC),
    )


# Generates a history and keeps only the values of one metric, oldest first.
def values(number: int, metric: MetricType, project_type: ProjectType) -> list[float]:
    history = SimulatedMetricsSource().history(site(number), project_type, UNTIL)
    return [float(item.value) for item in history if item.metric_type is metric]


# Generates the readings of one metric for a carbon project.
def carbon_history(number: int, metric: MetricType) -> list[MetricReading]:
    history = SimulatedMetricsSource().history(site(number), ProjectType.CARBON, UNTIL)
    return [item for item in history if item.metric_type is metric]


def test_produces_monthly_readings_for_every_metric() -> None:
    history = SimulatedMetricsSource().history(site(1), ProjectType.CARBON, UNTIL)

    assert len(history) == HISTORY_MONTHS * len(MetricType)
    months = [item.recorded_at for item in carbon_history(1, MetricType.NDVI)]
    assert months[-1] == date(2026, 9, 1)
    assert months[0] == date(2023, 10, 1)
    assert all(month.day == 1 for month in months)


def test_the_same_site_always_gets_the_same_history() -> None:
    first = SimulatedMetricsSource().history(site(7), ProjectType.CARBON, UNTIL)
    second = SimulatedMetricsSource().history(site(7), ProjectType.CARBON, UNTIL)

    assert first == second
    assert first != SimulatedMetricsSource().history(site(8), ProjectType.CARBON, UNTIL)


def test_values_stay_physically_possible() -> None:
    for number in range(40):
        assert all(
            0.05 <= value <= 0.95 for value in values(number, MetricType.NDVI, ProjectType.CARBON)
        )
        assert all(
            0 <= value <= 100
            for value in values(number, MetricType.CANOPY_COVER, ProjectType.CARBON)
        )
        assert all(
            value >= 0 for value in values(number, MetricType.SPECIES_RICHNESS, ProjectType.CARBON)
        )


def test_restoration_builds_carbon_over_time() -> None:
    for number in range(40):
        carbon = values(number, MetricType.CARBON_DENSITY, ProjectType.CARBON)
        assert mean(carbon[-12:]) > mean(carbon[:12])


def test_vegetation_is_greener_after_the_monsoon_than_before_it() -> None:
    readings = carbon_history(3, MetricType.NDVI)
    september = mean(float(item.value) for item in readings if item.recorded_at.month == 9)
    april = mean(float(item.value) for item in readings if item.recorded_at.month == 4)

    assert september > april


def test_biodiversity_projects_gain_more_species_than_carbon_projects() -> None:
    def average_gain(project_type: ProjectType) -> float:
        gains = []
        for number in range(40):
            species = values(number, MetricType.SPECIES_RICHNESS, project_type)
            gains.append(mean(species[-12:]) - mean(species[:12]))
        return mean(gains)

    assert average_gain(ProjectType.BIODIVERSITY) > average_gain(ProjectType.CARBON)
