# Response shape for a site's performance over time.
from datetime import date
from uuid import UUID

from pydantic import BaseModel

from src.application.dto.analytics_dto import MetricSeries, SiteAnalytics
from src.domain.entities.site_metric import METRIC_UNITS, MetricType


class MetricPoint(BaseModel):
    recorded_at: date
    value: float


class MetricSeriesResponse(BaseModel):
    metric: MetricType
    unit: str
    latest: float | None
    change_over_year_percent: float | None
    points: list[MetricPoint]

    @classmethod
    def from_series(cls, series: MetricSeries) -> "MetricSeriesResponse":
        return cls(
            metric=series.metric_type,
            unit=METRIC_UNITS[series.metric_type],
            latest=None if series.latest is None else float(series.latest),
            change_over_year_percent=(
                None
                if series.change_over_year_percent is None
                else float(series.change_over_year_percent)
            ),
            points=[
                MetricPoint(recorded_at=reading.recorded_at, value=float(reading.value))
                for reading in series.readings
            ],
        )


class SiteAnalyticsResponse(BaseModel):
    site_id: UUID
    area_hectares: float
    carbon_stock_tonnes: float | None
    series: list[MetricSeriesResponse]

    @classmethod
    def from_analytics(cls, analytics: SiteAnalytics) -> "SiteAnalyticsResponse":
        site = analytics.site.site
        return cls(
            site_id=site.id,
            area_hectares=float(site.area_hectares),
            carbon_stock_tonnes=(
                None
                if analytics.carbon_stock_tonnes is None
                else float(analytics.carbon_stock_tonnes)
            ),
            series=[MetricSeriesResponse.from_series(series) for series in analytics.series],
        )
