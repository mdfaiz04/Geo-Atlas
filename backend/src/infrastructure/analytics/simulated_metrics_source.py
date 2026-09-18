# Generates a believable, repeatable monitoring history until real satellite data is connected.
import random
from dataclasses import dataclass
from datetime import date
from decimal import Decimal

from src.application.ports.metrics_source import SiteMetricsSource
from src.domain.entities.project import ProjectType
from src.domain.entities.site import Site
from src.domain.entities.site_metric import MetricReading, MetricType
from src.infrastructure.analytics.seasonality import (
    MONTHS_PER_YEAR,
    dry_season_index,
    monsoon_wave,
    month_starts,
)
from src.infrastructure.analytics.site_profile import SiteProfile

HISTORY_MONTHS = 36
FIRST_POSSIBLE_FIRE = 12
FIRE_RECOVERY_MONTHS = 4
FIRE_CARBON_LOSS_SHARE = 0.06


@dataclass(frozen=True, slots=True)
class Moment:
    month: date
    progress: float
    years: float
    wave: float
    scar: float
    burnt: bool


# Keeps a simulated value inside its physically possible range.
def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


# How fresh a fire scar is: 1 in the month it burns, fading to 0 as vegetation recovers.
def fire_scar(index: int, fire_index: int | None) -> float:
    if fire_index is None or not 0 <= index - fire_index < FIRE_RECOVERY_MONTHS:
        return 0.0
    return 1 - (index - fire_index) / FIRE_RECOVERY_MONTHS


# Produces the four readings for one month of a site's life.
def measure(profile: SiteProfile, moment: Moment, rng: random.Random) -> list[MetricReading]:
    ndvi = clamp(
        profile.ndvi_base
        + profile.ndvi_gain * moment.progress
        + profile.ndvi_seasonal_swing * moment.wave
        - 0.12 * moment.scar
        + rng.gauss(0, 0.012),
        0.05,
        0.95,
    )
    canopy = clamp(
        profile.canopy_base
        + profile.canopy_gain * moment.progress
        + 2.5 * moment.wave
        - 8 * moment.scar
        + rng.gauss(0, 0.8),
        0,
        100,
    )
    fire_loss = FIRE_CARBON_LOSS_SHARE * profile.carbon_base if moment.burnt else 0.0
    carbon = (
        profile.carbon_base
        + profile.carbon_removal_per_year * moment.years
        - fire_loss
        + rng.gauss(0, 0.35)
    )
    species = max(
        0.0,
        profile.species_base
        + profile.species_gain * moment.progress
        + 3 * moment.wave
        - 5 * moment.scar
        + rng.gauss(0, 1.5),
    )
    values = {
        MetricType.NDVI: Decimal(f"{ndvi:.3f}"),
        MetricType.CANOPY_COVER: Decimal(f"{canopy:.1f}"),
        MetricType.CARBON_DENSITY: Decimal(f"{carbon:.2f}"),
        MetricType.SPECIES_RICHNESS: Decimal(round(species)),
    }
    return [MetricReading(metric, moment.month, value) for metric, value in values.items()]


class SimulatedMetricsSource(SiteMetricsSource):
    def history(self, site: Site, project_type: ProjectType, until: date) -> list[MetricReading]:
        rng = random.Random(site.id.int)
        profile = SiteProfile.draw(rng, project_type)
        months = month_starts(until, HISTORY_MONTHS)
        fire_index = dry_season_index(months, FIRST_POSSIBLE_FIRE) if profile.burns else None
        readings: list[MetricReading] = []
        for index, month in enumerate(months):
            moment = Moment(
                month=month,
                progress=index / (HISTORY_MONTHS - 1),
                years=index / MONTHS_PER_YEAR,
                wave=monsoon_wave(month.month),
                scar=fire_scar(index, fire_index),
                burnt=fire_index is not None and index >= fire_index,
            )
            readings.extend(measure(profile, moment, rng))
        return readings
