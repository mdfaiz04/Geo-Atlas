# Data returned by the site analytics use case.
from dataclasses import dataclass
from decimal import Decimal

from src.application.dto.site_dto import SiteView
from src.domain.entities.site_metric import MetricReading, MetricType


@dataclass(frozen=True, slots=True)
class MetricSeries:
    metric_type: MetricType
    readings: list[MetricReading]
    latest: Decimal | None
    change_over_year_percent: Decimal | None


@dataclass(frozen=True, slots=True)
class SiteAnalytics:
    site: SiteView
    series: list[MetricSeries]
    carbon_stock_tonnes: Decimal | None
