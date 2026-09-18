# A geographic site that belongs to a project.
from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from uuid import UUID

from src.domain.value_objects.polygon import Polygon


@dataclass(frozen=True, slots=True)
class Site:
    id: UUID
    project_id: UUID
    name: str
    boundary: Polygon
    area_hectares: Decimal
    created_at: datetime
