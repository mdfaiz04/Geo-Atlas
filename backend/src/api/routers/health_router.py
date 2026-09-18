# Reports service, database and PostGIS availability.
from fastapi import APIRouter
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from src.api.dependencies.database import SessionDep, SettingsDep
from src.api.schemas.health_schemas import HealthResponse

router = APIRouter(tags=["System"])


@router.get("/health", response_model=HealthResponse)
def read_health(session: SessionDep, settings: SettingsDep) -> HealthResponse:
    try:
        postgis_version = session.scalar(text("SELECT PostGIS_Version()"))
        database = "connected"
    except SQLAlchemyError:
        session.rollback()
        postgis_version = None
        database = "unavailable"
    return HealthResponse(
        status="ok" if database == "connected" else "degraded",
        environment=settings.environment,
        database=database,
        postgis_version=postgis_version,
    )
