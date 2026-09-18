# Loads a site with its project details, treating another owner's site as missing.
from uuid import UUID

from src.application.dto.site_dto import SiteView
from src.domain.exceptions import SiteNotFoundError
from src.domain.repositories.project_repository import ProjectRepository
from src.domain.repositories.site_repository import SiteRepository


def find_owned_site(
    projects: ProjectRepository, sites: SiteRepository, site_id: UUID, owner_id: UUID
) -> SiteView:
    site = sites.get_owned(site_id, owner_id)
    project = None if site is None else projects.get_owned(site.project_id, owner_id)
    if site is None or project is None:
        raise SiteNotFoundError
    return SiteView(site=site, project_name=project.name, project_type=project.project_type)
