# Deletes a project and, through the database cascade, all of its sites.
from uuid import UUID

from src.domain.exceptions import ProjectNotFoundError
from src.domain.repositories.project_repository import ProjectRepository


class DeleteProject:
    def __init__(self, projects: ProjectRepository) -> None:
        self._projects = projects

    def execute(self, project_id: UUID, owner_id: UUID) -> None:
        if self._projects.get_owned(project_id, owner_id) is None:
            raise ProjectNotFoundError
        self._projects.delete(project_id)
