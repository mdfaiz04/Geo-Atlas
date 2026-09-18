# Builds the performance-over-time view for one site.
from decimal import Decimal
from uuid import UUID

from src.application.dto.analytics_dto import MetricSeries, SiteAnalytics
from src.application.services.metric_summary import summarise
from src.application.services.site_lookup import find_owned_site
from src.domain.entities.site_metric import MetricType
from src.domain.repositories.project_repository import ProjectRepository
from src.domain.repositories.site_metric_repository import SiteMetricRepository
from src.domain.repositories.site_repository import SiteRepository

WHOLE_TONNES = Decimal("1")


# Turns the latest carbon density into the site's total stock using its measured area.
def total_carbon_stock(series: list[MetricSeries], area_hectares: Decimal) -> Decimal | None:
    density = next(
        (item.latest for item in series if item.metric_type is MetricType.CARBON_DENSITY), None
    )
    return None if density is None else (density * area_hectares).quantize(WHOLE_TONNES)


class GetSiteAnalytics:
    def __init__(
        self,
        projects: ProjectRepository,
        sites: SiteRepository,
        metrics: SiteMetricRepository,
    ) -> None:
        self._projects = projects
        self._sites = sites
        self._metrics = metrics

    def execute(self, site_id: UUID, owner_id: UUID) -> SiteAnalytics:
        view = find_owned_site(self._projects, self._sites, site_id, owner_id)
        readings = self._metrics.list_for_site(view.site.id)
        series = [summarise(metric_type, readings) for metric_type in MetricType]
        return SiteAnalytics(
            site=view,
            series=series,
            carbon_stock_tonnes=total_carbon_stock(series, view.site.area_hectares),
        )
