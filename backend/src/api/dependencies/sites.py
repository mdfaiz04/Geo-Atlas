# Wires the site and project repositories into the site use cases.
from typing import Annotated

from fastapi import Depends

from src.api.dependencies.database import SessionDep
from src.api.dependencies.projects import ProjectRepositoryDep
from src.application.use_cases.create_site import CreateSite
from src.application.use_cases.delete_site import DeleteSite
from src.application.use_cases.list_portfolio_sites import ListPortfolioSites
from src.application.use_cases.list_project_sites import ListProjectSites
from src.domain.repositories.site_repository import SiteRepository
from src.infrastructure.repositories.sqlalchemy_site_repository import SqlAlchemySiteRepository


def get_site_repository(session: SessionDep) -> SiteRepository:
    return SqlAlchemySiteRepository(session)


SiteRepositoryDep = Annotated[SiteRepository, Depends(get_site_repository)]


def get_create_site(projects: ProjectRepositoryDep, sites: SiteRepositoryDep) -> CreateSite:
    return CreateSite(projects, sites)


def get_list_project_sites(
    projects: ProjectRepositoryDep, sites: SiteRepositoryDep
) -> ListProjectSites:
    return ListProjectSites(projects, sites)


def get_list_portfolio_sites(
    projects: ProjectRepositoryDep, sites: SiteRepositoryDep
) -> ListPortfolioSites:
    return ListPortfolioSites(projects, sites)


def get_delete_site(sites: SiteRepositoryDep) -> DeleteSite:
    return DeleteSite(sites)


CreateSiteDep = Annotated[CreateSite, Depends(get_create_site)]
ListProjectSitesDep = Annotated[ListProjectSites, Depends(get_list_project_sites)]
ListPortfolioSitesDep = Annotated[ListPortfolioSites, Depends(get_list_portfolio_sites)]
DeleteSiteDep = Annotated[DeleteSite, Depends(get_delete_site)]
