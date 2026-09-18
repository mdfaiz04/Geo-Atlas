# Stores site boundaries in PostGIS and lets the database measure their area.
import json
from decimal import ROUND_HALF_UP, Decimal
from typing import Any
from uuid import UUID

from geoalchemy2 import Geography
from sqlalchemy import ColumnElement, Row, Select, cast, delete, func, select
from sqlalchemy.orm import Session

from src.domain.entities.site import Site
from src.domain.exceptions import InvalidGeometryError
from src.domain.repositories.site_repository import SiteRepository
from src.domain.value_objects.polygon import Polygon
from src.infrastructure.database.models.project_model import ProjectModel
from src.infrastructure.database.models.site_model import SiteModel

WGS84_SRID = 4326
SQUARE_METRES_PER_HECTARE = Decimal(10_000)
AREA_PRECISION = Decimal("0.0001")


# Turns a domain polygon into a PostGIS geometry expression in WGS84.
def to_geometry(boundary: Polygon) -> ColumnElement[Any]:
    geojson = json.dumps(boundary.to_geojson())
    return func.ST_SetSRID(func.ST_GeomFromGeoJSON(geojson), WGS84_SRID)


# Selects every site column with the boundary rendered back as GeoJSON.
def site_query() -> Select[Any]:
    return select(
        SiteModel.id,
        SiteModel.project_id,
        SiteModel.name,
        func.ST_AsGeoJSON(SiteModel.geom).label("geojson"),
        SiteModel.area_hectares,
        SiteModel.created_at,
    ).order_by(SiteModel.created_at)


# Copies a result row into the domain entity.
def to_site(row: Row[Any]) -> Site:
    return Site(
        id=row.id,
        project_id=row.project_id,
        name=row.name,
        boundary=Polygon.from_coordinates(json.loads(row.geojson)["coordinates"]),
        area_hectares=row.area_hectares,
        created_at=row.created_at,
    )


class SqlAlchemySiteRepository(SiteRepository):
    def __init__(self, session: Session) -> None:
        self._session = session

    def add(self, project_id: UUID, name: str, boundary: Polygon) -> Site:
        geometry = to_geometry(boundary)
        if not self._session.scalar(select(func.ST_IsValid(geometry))):
            raise InvalidGeometryError("the boundary crosses itself or encloses no area")
        area = self._measure_hectares(geometry)
        model = SiteModel(project_id=project_id, name=name, geom=geometry, area_hectares=area)
        self._session.add(model)
        self._session.flush()
        self._session.refresh(model, attribute_names=["created_at"])
        return Site(
            id=model.id,
            project_id=project_id,
            name=name,
            boundary=boundary,
            area_hectares=area,
            created_at=model.created_at,
        )

    def get_owned(self, site_id: UUID, owner_id: UUID) -> Site | None:
        row = self._session.execute(
            site_query()
            .join(ProjectModel, ProjectModel.id == SiteModel.project_id)
            .where(SiteModel.id == site_id, ProjectModel.owner_id == owner_id)
        ).one_or_none()
        return to_site(row) if row else None

    def list_for_project(self, project_id: UUID) -> list[Site]:
        rows = self._session.execute(site_query().where(SiteModel.project_id == project_id))
        return [to_site(row) for row in rows]

    def list_for_owner(self, owner_id: UUID) -> list[Site]:
        rows = self._session.execute(
            site_query()
            .join(ProjectModel, ProjectModel.id == SiteModel.project_id)
            .where(ProjectModel.owner_id == owner_id)
        )
        return [to_site(row) for row in rows]

    def delete(self, site_id: UUID) -> None:
        self._session.execute(delete(SiteModel).where(SiteModel.id == site_id))

    def _measure_hectares(self, geometry: ColumnElement[Any]) -> Decimal:
        square_metres = self._session.scalar(select(func.ST_Area(cast(geometry, Geography))))
        hectares = Decimal(str(square_metres)) / SQUARE_METRES_PER_HECTARE
        return hectares.quantize(AREA_PRECISION, rounding=ROUND_HALF_UP)
