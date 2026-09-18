# Covers drawing sites, PostGIS area and validity checks, and the GeoJSON responses.
from collections.abc import Callable

import pytest
from fastapi.testclient import TestClient

AuthHeaders = Callable[..., dict[str, str]]

SQUARE = [[[77.0, 28.0], [77.01, 28.0], [77.01, 28.01], [77.0, 28.01], [77.0, 28.0]]]
BOWTIE = [[[77.0, 28.0], [77.01, 28.01], [77.01, 28.0], [77.0, 28.01], [77.0, 28.0]]]
NEIGHBOUR = [[[77.01, 28.0], [77.02, 28.0], [77.02, 28.01], [77.01, 28.01], [77.01, 28.0]]]
INSIDE = [
    [[77.002, 28.002], [77.008, 28.002], [77.008, 28.008], [77.002, 28.008], [77.002, 28.002]]
]


# Creates a project for the given caller and returns its id.
def create_project(
    client: TestClient, headers: dict[str, str], name: str = "Aravalli Forest"
) -> str:
    response = client.post(
        "/api/v1/projects",
        json={"name": name, "project_type": "carbon"},
        headers=headers,
    )
    return str(response.json()["id"])


# Saves a site boundary into a project and returns the raw response.
def create_site(
    client: TestClient,
    headers: dict[str, str],
    project_id: str,
    coordinates: list = SQUARE,
    name: str = "North block",
):
    return client.post(
        f"/api/v1/projects/{project_id}/sites",
        json={"name": name, "geometry": {"type": "Polygon", "coordinates": coordinates}},
        headers=headers,
    )


def test_create_site_returns_a_geojson_feature_with_measured_area(
    client: TestClient, auth_headers: AuthHeaders
) -> None:
    headers = auth_headers()
    project_id = create_project(client, headers)

    response = create_site(client, headers, project_id)

    assert response.status_code == 201
    feature = response.json()
    assert feature["type"] == "Feature"
    assert feature["geometry"]["coordinates"] == SQUARE
    assert feature["properties"]["project_name"] == "Aravalli Forest"
    assert feature["properties"]["area_hectares"] == pytest.approx(109.3, abs=1.0)


def test_self_intersecting_boundary_is_rejected(
    client: TestClient, auth_headers: AuthHeaders
) -> None:
    headers = auth_headers()
    project_id = create_project(client, headers)

    response = create_site(client, headers, project_id, coordinates=BOWTIE)

    assert response.status_code == 422
    assert "crosses itself" in response.json()["detail"]


def test_open_ring_is_rejected(client: TestClient, auth_headers: AuthHeaders) -> None:
    headers = auth_headers()
    project_id = create_project(client, headers)

    response = create_site(client, headers, project_id, coordinates=[SQUARE[0][:-1]])

    assert response.status_code == 422


def test_site_cannot_be_added_to_another_owners_project(
    client: TestClient, auth_headers: AuthHeaders
) -> None:
    project_id = create_project(client, auth_headers())
    stranger = auth_headers("stranger@darukaa.earth")

    assert create_site(client, stranger, project_id).status_code == 404


def test_project_sites_are_returned_as_a_feature_collection(
    client: TestClient, auth_headers: AuthHeaders
) -> None:
    headers = auth_headers()
    project_id = create_project(client, headers)
    create_site(client, headers, project_id, name="North block")
    create_site(client, headers, project_id, coordinates=NEIGHBOUR, name="South block")

    body = client.get(f"/api/v1/projects/{project_id}/sites", headers=headers).json()

    assert body["type"] == "FeatureCollection"
    assert [feature["properties"]["name"] for feature in body["features"]] == [
        "North block",
        "South block",
    ]


def test_project_summary_counts_sites_and_area(
    client: TestClient, auth_headers: AuthHeaders
) -> None:
    headers = auth_headers()
    project_id = create_project(client, headers)
    create_site(client, headers, project_id)
    create_site(client, headers, project_id, coordinates=NEIGHBOUR)

    project = client.get(f"/api/v1/projects/{project_id}", headers=headers).json()

    assert project["site_count"] == 2
    assert project["total_area_hectares"] == pytest.approx(218.6, abs=2.0)


def test_portfolio_lists_sites_across_projects_for_the_owner_only(
    client: TestClient, auth_headers: AuthHeaders
) -> None:
    owner = auth_headers()
    stranger = auth_headers("stranger@darukaa.earth")
    create_site(client, owner, create_project(client, owner, "Forest"), name="Forest block")
    create_site(client, owner, create_project(client, owner, "Wetland"), name="Wetland block")
    create_site(client, stranger, create_project(client, stranger, "Other"), name="Hidden")

    body = client.get("/api/v1/sites", headers=owner).json()

    names = sorted(feature["properties"]["name"] for feature in body["features"])
    assert names == ["Forest block", "Wetland block"]


def test_delete_site_removes_it(client: TestClient, auth_headers: AuthHeaders) -> None:
    headers = auth_headers()
    project_id = create_project(client, headers)
    site_id = create_site(client, headers, project_id).json()["id"]

    assert client.delete(f"/api/v1/sites/{site_id}", headers=headers).status_code == 204
    assert client.delete(f"/api/v1/sites/{site_id}", headers=headers).status_code == 404


def test_deleting_a_project_removes_its_sites(
    client: TestClient, auth_headers: AuthHeaders
) -> None:
    headers = auth_headers()
    project_id = create_project(client, headers)
    create_site(client, headers, project_id)

    client.delete(f"/api/v1/projects/{project_id}", headers=headers)

    assert client.get("/api/v1/sites", headers=headers).json()["features"] == []


@pytest.mark.parametrize("coordinates", [SQUARE, INSIDE], ids=["identical", "contained"])
def test_overlapping_site_in_the_same_project_is_rejected(
    client: TestClient, auth_headers: AuthHeaders, coordinates: list
) -> None:
    headers = auth_headers()
    project_id = create_project(client, headers)
    create_site(client, headers, project_id, name="North block")

    response = create_site(client, headers, project_id, coordinates=coordinates, name="Overlap")

    assert response.status_code == 409
    assert "North block" in response.json()["detail"]


def test_sites_that_only_share_an_edge_are_allowed(
    client: TestClient, auth_headers: AuthHeaders
) -> None:
    headers = auth_headers()
    project_id = create_project(client, headers)
    create_site(client, headers, project_id)

    response = create_site(client, headers, project_id, coordinates=NEIGHBOUR, name="Next door")

    assert response.status_code == 201


def test_the_same_land_can_belong_to_different_projects(
    client: TestClient, auth_headers: AuthHeaders
) -> None:
    headers = auth_headers()
    create_site(client, headers, create_project(client, headers, "Forest carbon"))

    response = create_site(client, headers, create_project(client, headers, "Forest biodiversity"))

    assert response.status_code == 201
