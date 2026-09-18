# Endpoints for saving drawn sites and reading them back as GeoJSON.
from uuid import UUID

from fastapi import APIRouter, status

from src.api.dependencies.auth import CurrentUserDep
from src.api.dependencies.sites import (
    CreateSiteDep,
    DeleteSiteDep,
    ListPortfolioSitesDep,
    ListProjectSitesDep,
)
from src.api.schemas.site_schemas import CreateSiteRequest, SiteFeature, SiteFeatureCollection
from src.application.dto.site_dto import CreateSiteCommand
from src.domain.value_objects.polygon import Polygon

router = APIRouter(tags=["Sites"])


@router.get("/sites", response_model=SiteFeatureCollection)
def list_portfolio_sites(
    current_user: CurrentUserDep, use_case: ListPortfolioSitesDep
) -> SiteFeatureCollection:
    return SiteFeatureCollection.from_views(use_case.execute(current_user.id))


@router.get("/projects/{project_id}/sites", response_model=SiteFeatureCollection)
def list_project_sites(
    project_id: UUID, current_user: CurrentUserDep, use_case: ListProjectSitesDep
) -> SiteFeatureCollection:
    return SiteFeatureCollection.from_views(use_case.execute(project_id, current_user.id))


@router.post(
    "/projects/{project_id}/sites",
    response_model=SiteFeature,
    status_code=status.HTTP_201_CREATED,
)
def create_site(
    project_id: UUID,
    payload: CreateSiteRequest,
    current_user: CurrentUserDep,
    use_case: CreateSiteDep,
) -> SiteFeature:
    command = CreateSiteCommand(
        owner_id=current_user.id,
        project_id=project_id,
        name=payload.name,
        boundary=Polygon.from_coordinates(payload.geometry.coordinates),
    )
    return SiteFeature.from_view(use_case.execute(command))


@router.delete("/sites/{site_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_site(site_id: UUID, current_user: CurrentUserDep, use_case: DeleteSiteDep) -> None:
    use_case.execute(site_id, current_user.id)
