# Carbon and biodiversity projects, plus the summary shown in portfolio listings.
from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from enum import StrEnum
from uuid import UUID


class ProjectType(StrEnum):
    CARBON = "carbon"
    BIODIVERSITY = "biodiversity"


class ProjectStatus(StrEnum):
    ACTIVE = "active"
    ARCHIVED = "archived"


@dataclass(frozen=True, slots=True)
class Project:
    id: UUID
    owner_id: UUID
    name: str
    description: str | None
    project_type: ProjectType
    status: ProjectStatus
    created_at: datetime


@dataclass(frozen=True, slots=True)
class ProjectSummary:
    project: Project
    site_count: int
    total_area_hectares: Decimal
