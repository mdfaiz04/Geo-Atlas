# Loads one project, treating another owner's project as missing.
from uuid import UUID

from src.domain.entities.project import ProjectSummary
from src.domain.exceptions import ProjectNotFoundError
from src.domain.repositories.project_repository import ProjectRepository


class GetProject:
    def __init__(self, projects: ProjectRepository) -> None:
        self._projects = projects

    def execute(self, project_id: UUID, owner_id: UUID) -> ProjectSummary:
        summary = self._projects.get_summary(project_id, owner_id)
        if summary is None:
            raise ProjectNotFoundError
        return summary
