# Loads one site the administrator owns.
from uuid import UUID

from src.application.dto.site_dto import SiteView
from src.application.services.site_lookup import find_owned_site
from src.domain.repositories.project_repository import ProjectRepository
from src.domain.repositories.site_repository import SiteRepository


class GetSite:
    def __init__(self, projects: ProjectRepository, sites: SiteRepository) -> None:
        self._projects = projects
        self._sites = sites

    def execute(self, site_id: UUID, owner_id: UUID) -> SiteView:
        return find_owned_site(self._projects, self._sites, site_id, owner_id)
