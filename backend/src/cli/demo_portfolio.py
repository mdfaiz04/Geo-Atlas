# The demo portfolio: real Indian landscapes with illustrative project boundaries.
from dataclasses import dataclass

from src.domain.entities.project import ProjectType


@dataclass(frozen=True, slots=True)
class DemoSite:
    name: str
    longitude: float
    latitude: float
    radius_km: float


@dataclass(frozen=True, slots=True)
class DemoProject:
    name: str
    description: str
    project_type: ProjectType
    sites: tuple[DemoSite, ...]


DEMO_PORTFOLIO: tuple[DemoProject, ...] = (
    DemoProject(
        name="Aravalli Forest Restoration",
        description="Restoring native dry-deciduous forest on degraded Aravalli ridges "
        "between Gurugram and Faridabad.",
        project_type=ProjectType.CARBON,
        sites=(
            DemoSite("Mangar Bani Buffer", 77.155, 28.405, 1.3),
            DemoSite("Damdama Ridge", 77.125, 28.305, 1.1),
            DemoSite("Asola Fringe", 77.235, 28.470, 1.0),
        ),
    ),
    DemoProject(
        name="Sundarbans Mangrove Belt",
        description="Replanting and protecting mangrove belts along the tidal creeks "
        "of the Indian Sundarbans.",
        project_type=ProjectType.BIODIVERSITY,
        sites=(
            DemoSite("Gosaba Creek", 88.805, 22.165, 1.4),
            DemoSite("Pakhiralaya Shore", 88.840, 22.110, 1.2),
        ),
    ),
    DemoProject(
        name="Kodagu Agroforestry",
        description="Shade-grown coffee under native canopy trees on smallholder farms in Kodagu.",
        project_type=ProjectType.CARBON,
        sites=(
            DemoSite("Madikeri Estates", 75.735, 12.425, 1.1),
            DemoSite("Virajpet Holdings", 75.805, 12.195, 1.2),
        ),
    ),
    DemoProject(
        name="Kaziranga Grassland Corridor",
        description="Reconnecting grassland and wetland habitat between Kaziranga "
        "and the Karbi Anglong hills.",
        project_type=ProjectType.BIODIVERSITY,
        sites=(
            DemoSite("Panbari Corridor", 93.550, 26.600, 1.5),
            DemoSite("Kanchanjuri Link", 93.430, 26.560, 1.3),
        ),
    ),
)
