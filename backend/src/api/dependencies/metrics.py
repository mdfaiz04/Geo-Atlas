# Provides the measurement store and the source that fills it.
from typing import Annotated

from fastapi import Depends

from src.api.dependencies.database import SessionDep
from src.application.ports.metrics_source import SiteMetricsSource
from src.domain.repositories.site_metric_repository import SiteMetricRepository
from src.infrastructure.analytics.simulated_metrics_source import SimulatedMetricsSource
from src.infrastructure.repositories.sqlalchemy_site_metric_repository import (
    SqlAlchemySiteMetricRepository,
)


def get_site_metric_repository(session: SessionDep) -> SiteMetricRepository:
    return SqlAlchemySiteMetricRepository(session)


def get_metrics_source() -> SiteMetricsSource:
    return SimulatedMetricsSource()


SiteMetricRepositoryDep = Annotated[SiteMetricRepository, Depends(get_site_metric_repository)]
MetricsSourceDep = Annotated[SiteMetricsSource, Depends(get_metrics_source)]
