# Measurements recorded for a site over time, such as carbon density or vegetation health.
from dataclasses import dataclass
from datetime import date
from decimal import Decimal
from enum import StrEnum


class MetricType(StrEnum):
    CARBON_DENSITY = "carbon_density"
    NDVI = "ndvi"
    CANOPY_COVER = "canopy_cover"
    SPECIES_RICHNESS = "species_richness"


METRIC_UNITS: dict[MetricType, str] = {
    MetricType.CARBON_DENSITY: "tCO2e/ha",
    MetricType.NDVI: "index",
    MetricType.CANOPY_COVER: "%",
    MetricType.SPECIES_RICHNESS: "species",
}


@dataclass(frozen=True, slots=True)
class MetricReading:
    metric_type: MetricType
    recorded_at: date
    value: Decimal

    @property
    def unit(self) -> str:
        return METRIC_UNITS[self.metric_type]
