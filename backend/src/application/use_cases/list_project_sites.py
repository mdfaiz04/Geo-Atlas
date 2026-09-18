# Lists the sites inside a single project.
from uuid import UUID

from src.application.dto.site_dto import SiteView
from src.domain.exceptions import ProjectNotFoundError
from src.domain.repositories.project_repository import ProjectRepository
from src.domain.repositories.site_repository import SiteRepository


class ListProjectSites:
    def __init__(self, projects: ProjectRepository, sites: SiteRepository) -> None:
        self._projects = projects
        self._sites = sites

    def execute(self, project_id: UUID, owner_id: UUID) -> list[SiteView]:
        project = self._projects.get_owned(project_id, owner_id)
        if project is None:
            raise ProjectNotFoundError
        return [
            SiteView(site=site, project_name=project.name, project_type=project.project_type)
            for site in self._sites.list_for_project(project.id)
        ]
