# Where a site's measurement history comes from: simulated today, satellite data later.
from abc import ABC, abstractmethod
from datetime import date

from src.domain.entities.project import ProjectType
from src.domain.entities.site import Site
from src.domain.entities.site_metric import MetricReading


class SiteMetricsSource(ABC):
    @abstractmethod
    def history(
        self, site: Site, project_type: ProjectType, until: date
    ) -> list[MetricReading]: ...
