# Condenses a metric's readings into its latest value and its change since the same month last year.
from decimal import ROUND_HALF_UP, Decimal

from src.application.dto.analytics_dto import MetricSeries
from src.domain.entities.site_metric import MetricReading, MetricType

PERCENT_PRECISION = Decimal("0.1")


# Returns the percentage change, or nothing when there is no usable baseline.
def percent_change(before: Decimal | None, after: Decimal) -> Decimal | None:
    if before is None or before == 0:
        return None
    change = (after - before) / abs(before) * 100
    return change.quantize(PERCENT_PRECISION, rounding=ROUND_HALF_UP)


# Compares against the same month a year earlier so seasonal swings do not look like progress.
def summarise(metric_type: MetricType, readings: list[MetricReading]) -> MetricSeries:
    ordered = sorted(
        (reading for reading in readings if reading.metric_type == metric_type),
        key=lambda reading: reading.recorded_at,
    )
    if not ordered:
        return MetricSeries(metric_type, [], None, None)
    latest = ordered[-1]
    baseline_month = (latest.recorded_at.year - 1, latest.recorded_at.month)
    baseline = next(
        (
            reading
            for reading in ordered
            if (reading.recorded_at.year, reading.recorded_at.month) == baseline_month
        ),
        None,
    )
    return MetricSeries(
        metric_type=metric_type,
        readings=ordered,
        latest=latest.value,
        change_over_year_percent=percent_change(
            None if baseline is None else baseline.value, latest.value
        ),
    )
