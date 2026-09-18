# GeoJSON request and response shapes for the site endpoints.
from datetime import datetime
from typing import Annotated, Literal
from uuid import UUID

from pydantic import BaseModel, Field, StringConstraints

from src.application.dto.site_dto import SiteView
from src.domain.entities.project import ProjectType

SiteName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=2, max_length=160)]


class PolygonGeometry(BaseModel):
    type: Literal["Polygon"]
    coordinates: list[list[list[float]]] = Field(min_length=1)


class CreateSiteRequest(BaseModel):
    name: SiteName
    geometry: PolygonGeometry


class SiteProperties(BaseModel):
    id: UUID
    name: str
    project_id: UUID
    project_name: str
    project_type: ProjectType
    area_hectares: float
    created_at: datetime


class SiteFeature(BaseModel):
    type: Literal["Feature"] = "Feature"
    id: UUID
    geometry: PolygonGeometry
    properties: SiteProperties

    @classmethod
    def from_view(cls, view: SiteView) -> "SiteFeature":
        site = view.site
        return cls(
            id=site.id,
            geometry=PolygonGeometry.model_validate(site.boundary.to_geojson()),
            properties=SiteProperties(
                id=site.id,
                name=site.name,
                project_id=site.project_id,
                project_name=view.project_name,
                project_type=view.project_type,
                area_hectares=float(site.area_hectares),
                created_at=site.created_at,
            ),
        )


class SiteFeatureCollection(BaseModel):
    type: Literal["FeatureCollection"] = "FeatureCollection"
    features: list[SiteFeature]

    @classmethod
    def from_views(cls, views: list[SiteView]) -> "SiteFeatureCollection":
        return cls(features=[SiteFeature.from_view(view) for view in views])
