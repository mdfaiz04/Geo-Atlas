# Stores and reads a site's measurement history through SQLAlchemy.
from collections.abc import Sequence
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.domain.entities.site_metric import MetricReading, MetricType
from src.domain.repositories.site_metric_repository import SiteMetricRepository
from src.infrastructure.database.models.site_metric_model import SiteMetricModel


class SqlAlchemySiteMetricRepository(SiteMetricRepository):
    def __init__(self, session: Session) -> None:
        self._session = session

    def add_many(self, site_id: UUID, readings: Sequence[MetricReading]) -> None:
        self._session.add_all(
            SiteMetricModel(
                site_id=site_id,
                metric_type=reading.metric_type.value,
                recorded_at=reading.recorded_at,
                value=reading.value,
                unit=reading.unit,
            )
            for reading in readings
        )
        self._session.flush()

    def list_for_site(self, site_id: UUID) -> list[MetricReading]:
        models = self._session.scalars(
            select(SiteMetricModel)
            .where(SiteMetricModel.site_id == site_id)
            .order_by(SiteMetricModel.metric_type, SiteMetricModel.recorded_at)
        )
        return [
            MetricReading(
                metric_type=MetricType(model.metric_type),
                recorded_at=model.recorded_at,
                value=model.value,
            )
            for model in models
        ]
