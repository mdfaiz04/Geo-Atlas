# Request and response shapes for the project endpoints.
from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, StringConstraints

from src.domain.entities.project import ProjectStatus, ProjectSummary, ProjectType

ProjectName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=2, max_length=160)]
ProjectDescription = Annotated[str, StringConstraints(strip_whitespace=True, max_length=2000)]


class CreateProjectRequest(BaseModel):
    name: ProjectName
    description: ProjectDescription | None = None
    project_type: ProjectType


class ProjectResponse(BaseModel):
    id: UUID
    name: str
    description: str | None
    project_type: ProjectType
    status: ProjectStatus
    site_count: int
    total_area_hectares: float
    created_at: datetime

    @classmethod
    def from_summary(cls, summary: ProjectSummary) -> "ProjectResponse":
        project = summary.project
        return cls(
            id=project.id,
            name=project.name,
            description=project.description,
            project_type=project.project_type,
            status=project.status,
            site_count=summary.site_count,
            total_area_hectares=float(summary.total_area_hectares),
            created_at=project.created_at,
        )
