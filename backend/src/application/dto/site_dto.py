# Data carried in and out of the site use cases.
from dataclasses import dataclass
from uuid import UUID

from src.domain.entities.project import ProjectType
from src.domain.entities.site import Site
from src.domain.value_objects.polygon import Polygon


@dataclass(frozen=True, slots=True)
class CreateSiteCommand:
    owner_id: UUID
    project_id: UUID
    name: str
    boundary: Polygon


@dataclass(frozen=True, slots=True)
class SiteView:
    site: Site
    project_name: str
    project_type: ProjectType
