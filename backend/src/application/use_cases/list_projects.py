# Lists every project the administrator owns, newest first.
from uuid import UUID

from src.domain.entities.project import ProjectSummary
from src.domain.repositories.project_repository import ProjectRepository


class ListProjects:
    def __init__(self, projects: ProjectRepository) -> None:
        self._projects = projects

    def execute(self, owner_id: UUID) -> list[ProjectSummary]:
        return self._projects.list_summaries(owner_id)
