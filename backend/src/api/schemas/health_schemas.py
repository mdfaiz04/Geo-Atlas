# Response shape for the service health endpoint.
from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    environment: str
    database: str
    postgis_version: str | None
