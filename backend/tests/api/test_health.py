# Confirms the service reports its database and PostGIS status.
from fastapi.testclient import TestClient


def test_health_reports_postgis_availability(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["database"] == "connected"
    assert body["postgis_version"]
