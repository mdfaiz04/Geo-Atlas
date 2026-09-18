# Lists every site across the whole portfolio for the overview map.
from uuid import UUID

from src.application.dto.site_dto import SiteView
from src.domain.repositories.project_repository import ProjectRepository
from src.domain.repositories.site_repository import SiteRepository


class ListPortfolioSites:
    def __init__(self, projects: ProjectRepository, sites: SiteRepository) -> None:
        self._projects = projects
        self._sites = sites

    def execute(self, owner_id: UUID) -> list[SiteView]:
        projects = {
            summary.project.id: summary.project
            for summary in self._projects.list_summaries(owner_id)
        }
        return [
            SiteView(
                site=site,
                project_name=projects[site.project_id].name,
                project_type=projects[site.project_id].project_type,
            )
            for site in self._sites.list_for_owner(owner_id)
            if site.project_id in projects
        ]
