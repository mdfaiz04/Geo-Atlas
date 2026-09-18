# Checks the latest value and the year-on-year change reported for each metric.
from datetime import date
from decimal import Decimal

from src.application.services.metric_summary import summarise
from src.domain.entities.site_metric import MetricReading, MetricType

NDVI = MetricType.NDVI


# Builds one NDVI reading for the first day of a month.
def reading(year: int, month: int, value: str, metric: MetricType = NDVI) -> MetricReading:
    return MetricReading(metric, date(year, month, 1), Decimal(value))


def test_empty_history_has_no_latest_value_or_change() -> None:
    series = summarise(NDVI, [])

    assert series.latest is None
    assert series.change_over_year_percent is None


def test_change_is_measured_against_the_same_month_last_year() -> None:
    readings = [reading(2025, 9, "0.500"), reading(2026, 3, "0.300"), reading(2026, 9, "0.550")]

    series = summarise(NDVI, readings)

    assert series.latest == Decimal("0.550")
    assert series.change_over_year_percent == Decimal("10.0")


def test_readings_are_returned_oldest_first() -> None:
    readings = [reading(2026, 9, "0.6"), reading(2026, 7, "0.4"), reading(2026, 8, "0.5")]

    months = [item.recorded_at.month for item in summarise(NDVI, readings).readings]

    assert months == [7, 8, 9]


def test_change_is_unknown_without_a_year_of_history() -> None:
    series = summarise(NDVI, [reading(2026, 3, "0.4"), reading(2026, 9, "0.5")])

    assert series.change_over_year_percent is None


def test_change_is_unknown_when_the_baseline_is_zero() -> None:
    series = summarise(NDVI, [reading(2025, 9, "0"), reading(2026, 9, "0.5")])

    assert series.change_over_year_percent is None


def test_other_metrics_are_ignored() -> None:
    readings = [reading(2026, 9, "0.5"), reading(2026, 9, "72.0", MetricType.CANOPY_COVER)]

    series = summarise(NDVI, readings)

    assert [item.metric_type for item in series.readings] == [NDVI]
