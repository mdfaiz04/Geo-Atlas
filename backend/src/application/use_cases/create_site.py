# Adds a drawn boundary to a project and records the site's monitoring history.
from src.application.dto.site_dto import CreateSiteCommand, SiteView
from src.application.ports.metrics_source import SiteMetricsSource
from src.domain.exceptions import OverlappingSiteError, ProjectNotFoundError
from src.domain.repositories.project_repository import ProjectRepository
from src.domain.repositories.site_metric_repository import SiteMetricRepository
from src.domain.repositories.site_repository import SiteRepository


class CreateSite:
    def __init__(
        self,
        projects: ProjectRepository,
        sites: SiteRepository,
        metrics: SiteMetricRepository,
        metrics_source: SiteMetricsSource,
    ) -> None:
        self._projects = projects
        self._sites = sites
        self._metrics = metrics
        self._metrics_source = metrics_source

    def execute(self, command: CreateSiteCommand) -> SiteView:
        project = self._projects.get_owned(command.project_id, command.owner_id)
        if project is None:
            raise ProjectNotFoundError
        overlapping = self._sites.find_overlapping(project.id, command.boundary)
        if overlapping is not None:
            raise OverlappingSiteError(overlapping)
        site = self._sites.add(project.id, command.name, command.boundary)
        history = self._metrics_source.history(site, project.project_type, site.created_at.date())
        self._metrics.add_many(site.id, history)
        return SiteView(site=site, project_name=project.name, project_type=project.project_type)
