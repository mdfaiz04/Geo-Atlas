# Wires the repositories into the site analytics use case.
from typing import Annotated

from fastapi import Depends

from src.api.dependencies.metrics import SiteMetricRepositoryDep
from src.api.dependencies.projects import ProjectRepositoryDep
from src.api.dependencies.sites import SiteRepositoryDep
from src.application.use_cases.get_site_analytics import GetSiteAnalytics


def get_site_analytics(
    projects: ProjectRepositoryDep, sites: SiteRepositoryDep, metrics: SiteMetricRepositoryDep
) -> GetSiteAnalytics:
    return GetSiteAnalytics(projects, sites, metrics)


GetSiteAnalyticsDep = Annotated[GetSiteAnalytics, Depends(get_site_analytics)]
