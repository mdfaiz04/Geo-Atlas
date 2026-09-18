# Adds a drawn boundary to one of the administrator's projects.
from src.application.dto.site_dto import CreateSiteCommand, SiteView
from src.domain.exceptions import OverlappingSiteError, ProjectNotFoundError
from src.domain.repositories.project_repository import ProjectRepository
from src.domain.repositories.site_repository import SiteRepository


class CreateSite:
    def __init__(self, projects: ProjectRepository, sites: SiteRepository) -> None:
        self._projects = projects
        self._sites = sites

    def execute(self, command: CreateSiteCommand) -> SiteView:
        project = self._projects.get_owned(command.project_id, command.owner_id)
        if project is None:
            raise ProjectNotFoundError
        overlapping = self._sites.find_overlapping(project.id, command.boundary)
        if overlapping is not None:
            raise OverlappingSiteError(overlapping)
        site = self._sites.add(project.id, command.name, command.boundary)
        return SiteView(site=site, project_name=project.name, project_type=project.project_type)
