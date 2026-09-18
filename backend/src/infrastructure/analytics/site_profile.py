# The random but repeatable parameters that give each simulated site its own character.
import random
from dataclasses import dataclass

from src.domain.entities.project import ProjectType

FIRE_PROBABILITY = 0.3


@dataclass(frozen=True, slots=True)
class GrowthRange:
    carbon_removal_per_year: tuple[float, float]
    canopy_gain: tuple[float, float]
    species_gain: tuple[float, float]


GROWTH_BY_TYPE: dict[ProjectType, GrowthRange] = {
    ProjectType.CARBON: GrowthRange(
        carbon_removal_per_year=(4.0, 9.0), canopy_gain=(8.0, 16.0), species_gain=(3.0, 10.0)
    ),
    ProjectType.BIODIVERSITY: GrowthRange(
        carbon_removal_per_year=(1.5, 4.0), canopy_gain=(4.0, 10.0), species_gain=(12.0, 28.0)
    ),
}


@dataclass(frozen=True, slots=True)
class SiteProfile:
    ndvi_base: float
    ndvi_gain: float
    ndvi_seasonal_swing: float
    canopy_base: float
    canopy_gain: float
    carbon_base: float
    carbon_removal_per_year: float
    species_base: float
    species_gain: float
    burns: bool

    @classmethod
    def draw(cls, rng: random.Random, project_type: ProjectType) -> "SiteProfile":
        growth = GROWTH_BY_TYPE[project_type]
        return cls(
            ndvi_base=rng.uniform(0.28, 0.42),
            ndvi_gain=rng.uniform(0.06, 0.14),
            ndvi_seasonal_swing=rng.uniform(0.08, 0.16),
            canopy_base=rng.uniform(18.0, 35.0),
            canopy_gain=rng.uniform(*growth.canopy_gain),
            carbon_base=rng.uniform(40.0, 90.0),
            carbon_removal_per_year=rng.uniform(*growth.carbon_removal_per_year),
            species_base=rng.uniform(25.0, 60.0),
            species_gain=rng.uniform(*growth.species_gain),
            burns=rng.random() < FIRE_PROBABILITY,
        )
