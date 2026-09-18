# Covers reading a single site and its performance over time.
from collections.abc import Callable

import pytest
from fastapi.testclient import TestClient

AuthHeaders = Callable[..., dict[str, str]]

SQUARE = [[[77.0, 28.0], [77.01, 28.0], [77.01, 28.01], [77.0, 28.01], [77.0, 28.0]]]
METRICS = ["carbon_density", "ndvi", "canopy_cover", "species_richness"]


# Creates a project with one site for the caller and returns the site id.
def create_site(client: TestClient, headers: dict[str, str]) -> str:
    project = client.post(
        "/api/v1/projects",
        json={"name": "Aravalli Forest", "project_type": "carbon"},
        headers=headers,
    ).json()
    site = client.post(
        f"/api/v1/projects/{project['id']}/sites",
        json={"name": "North block", "geometry": {"type": "Polygon", "coordinates": SQUARE}},
        headers=headers,
    ).json()
    return str(site["id"])


def test_read_site_returns_its_feature(client: TestClient, auth_headers: AuthHeaders) -> None:
    headers = auth_headers()
    site_id = create_site(client, headers)

    feature = client.get(f"/api/v1/sites/{site_id}", headers=headers).json()

    assert feature["properties"]["name"] == "North block"
    assert feature["properties"]["project_name"] == "Aravalli Forest"


def test_new_site_comes_with_three_years_of_monthly_history(
    client: TestClient, auth_headers: AuthHeaders
) -> None:
    headers = auth_headers()
    site_id = create_site(client, headers)

    body = client.get(f"/api/v1/sites/{site_id}/analytics", headers=headers).json()

    assert [series["metric"] for series in body["series"]] == METRICS
    assert all(len(series["points"]) == 36 for series in body["series"])
    assert all(series["latest"] is not None for series in body["series"])
    assert all(series["change_over_year_percent"] is not None for series in body["series"])


def test_carbon_stock_is_latest_density_times_area(
    client: TestClient, auth_headers: AuthHeaders
) -> None:
    headers = auth_headers()
    site_id = create_site(client, headers)

    body = client.get(f"/api/v1/sites/{site_id}/analytics", headers=headers).json()

    density = next(item["latest"] for item in body["series"] if item["metric"] == "carbon_density")
    assert body["carbon_stock_tonnes"] == pytest.approx(density * body["area_hectares"], abs=1)


def test_units_are_reported_with_each_series(client: TestClient, auth_headers: AuthHeaders) -> None:
    headers = auth_headers()
    site_id = create_site(client, headers)

    body = client.get(f"/api/v1/sites/{site_id}/analytics", headers=headers).json()

    assert {series["metric"]: series["unit"] for series in body["series"]} == {
        "carbon_density": "tCO2e/ha",
        "ndvi": "index",
        "canopy_cover": "%",
        "species_richness": "species",
    }


def test_another_owners_site_is_reported_as_missing(
    client: TestClient, auth_headers: AuthHeaders
) -> None:
    site_id = create_site(client, auth_headers())
    stranger = auth_headers("stranger@darukaa.earth")

    assert client.get(f"/api/v1/sites/{site_id}", headers=stranger).status_code == 404
    assert client.get(f"/api/v1/sites/{site_id}/analytics", headers=stranger).status_code == 404


def test_analytics_require_authentication(client: TestClient, auth_headers: AuthHeaders) -> None:
    site_id = create_site(client, auth_headers())

    assert client.get(f"/api/v1/sites/{site_id}/analytics").status_code == 401
