# Contract for storing and reading a site's measurement history.
from abc import ABC, abstractmethod
from collections.abc import Sequence
from uuid import UUID

from src.domain.entities.site_metric import MetricReading


class SiteMetricRepository(ABC):
    @abstractmethod
    def add_many(self, site_id: UUID, readings: Sequence[MetricReading]) -> None: ...

    @abstractmethod
    def list_for_site(self, site_id: UUID) -> list[MetricReading]: ...
