# Data carried into the project use cases.
from dataclasses import dataclass
from uuid import UUID

from src.domain.entities.project import ProjectType


@dataclass(frozen=True, slots=True)
class CreateProjectCommand:
    owner_id: UUID
    name: str
    description: str | None
    project_type: ProjectType
