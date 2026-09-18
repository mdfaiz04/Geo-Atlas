# Endpoint serving a site's performance over time.
from uuid import UUID

from fastapi import APIRouter

from src.api.dependencies.analytics import GetSiteAnalyticsDep
from src.api.dependencies.auth import CurrentUserDep
from src.api.schemas.analytics_schemas import SiteAnalyticsResponse

router = APIRouter(tags=["Analytics"])


@router.get("/sites/{site_id}/analytics", response_model=SiteAnalyticsResponse)
def read_site_analytics(
    site_id: UUID, current_user: CurrentUserDep, use_case: GetSiteAnalyticsDep
) -> SiteAnalyticsResponse:
    return SiteAnalyticsResponse.from_analytics(use_case.execute(site_id, current_user.id))
