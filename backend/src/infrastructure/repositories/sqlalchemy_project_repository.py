# Stores projects and computes their portfolio summaries through SQLAlchemy.
from decimal import Decimal
from typing import Any
from uuid import UUID

from sqlalchemy import Row, Select, delete, func, select
from sqlalchemy.orm import Session

from src.domain.entities.project import Project, ProjectStatus, ProjectSummary, ProjectType
from src.domain.repositories.project_repository import ProjectRepository
from src.infrastructure.database.models.project_model import ProjectModel
from src.infrastructure.database.models.site_model import SiteModel


# Copies an ORM row into the domain entity.
def to_project(model: ProjectModel) -> Project:
    return Project(
        id=model.id,
        owner_id=model.owner_id,
        name=model.name,
        description=model.description,
        project_type=ProjectType(model.project_type),
        status=ProjectStatus(model.status),
        created_at=model.created_at,
    )


# Turns a joined project row into a summary with its site count and total area.
def to_summary(row: Row[Any]) -> ProjectSummary:
    model, site_count, total_area = row
    return ProjectSummary(
        project=to_project(model),
        site_count=int(site_count),
        total_area_hectares=Decimal(total_area),
    )


# Joins each owned project to the number and combined area of its sites.
def summary_query(owner_id: UUID) -> Select[Any]:
    return (
        select(
            ProjectModel,
            func.count(SiteModel.id),
            func.coalesce(func.sum(SiteModel.area_hectares), 0),
        )
        .outerjoin(SiteModel, SiteModel.project_id == ProjectModel.id)
        .where(ProjectModel.owner_id == owner_id)
        .group_by(ProjectModel.id)
    )


class SqlAlchemyProjectRepository(ProjectRepository):
    def __init__(self, session: Session) -> None:
        self._session = session

    def add(
        self, owner_id: UUID, name: str, description: str | None, project_type: ProjectType
    ) -> Project:
        model = ProjectModel(
            owner_id=owner_id,
            name=name,
            description=description,
            project_type=project_type.value,
            status=ProjectStatus.ACTIVE.value,
        )
        self._session.add(model)
        self._session.flush()
        self._session.refresh(model)
        return to_project(model)

    def get_owned(self, project_id: UUID, owner_id: UUID) -> Project | None:
        model = self._session.scalar(
            select(ProjectModel).where(
                ProjectModel.id == project_id, ProjectModel.owner_id == owner_id
            )
        )
        return to_project(model) if model else None

    def get_summary(self, project_id: UUID, owner_id: UUID) -> ProjectSummary | None:
        row = self._session.execute(
            summary_query(owner_id).where(ProjectModel.id == project_id)
        ).one_or_none()
        return to_summary(row) if row else None

    def list_summaries(self, owner_id: UUID) -> list[ProjectSummary]:
        rows = self._session.execute(
            summary_query(owner_id).order_by(ProjectModel.created_at.desc())
        ).all()
        return [to_summary(row) for row in rows]

    def delete(self, project_id: UUID) -> None:
        self._session.execute(delete(ProjectModel).where(ProjectModel.id == project_id))
