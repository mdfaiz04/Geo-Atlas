# Covers project creation, listing, ownership and deletion.
from collections.abc import Callable

from fastapi.testclient import TestClient

PROJECTS_URL = "/api/v1/projects"
AuthHeaders = Callable[..., dict[str, str]]

FOREST_PROJECT = {
    "name": "Western Ghats Reforestation",
    "description": "Native species restoration",
    "project_type": "carbon",
}


def test_create_project_starts_with_no_sites(client: TestClient, auth_headers: AuthHeaders) -> None:
    response = client.post(PROJECTS_URL, json=FOREST_PROJECT, headers=auth_headers())

    assert response.status_code == 201
    body = response.json()
    assert body["name"] == FOREST_PROJECT["name"]
    assert body["project_type"] == "carbon"
    assert body["status"] == "active"
    assert body["site_count"] == 0
    assert body["total_area_hectares"] == 0


def test_create_project_rejects_unknown_type(client: TestClient, auth_headers: AuthHeaders) -> None:
    payload = {**FOREST_PROJECT, "project_type": "mining"}

    response = client.post(PROJECTS_URL, json=payload, headers=auth_headers())

    assert response.status_code == 422


def test_create_project_trims_whitespace_and_blank_description(
    client: TestClient, auth_headers: AuthHeaders
) -> None:
    payload = {
        "name": "  Sundarbans Mangroves  ",
        "description": "   ",
        "project_type": "biodiversity",
    }

    body = client.post(PROJECTS_URL, json=payload, headers=auth_headers()).json()

    assert body["name"] == "Sundarbans Mangroves"
    assert body["description"] is None


def test_projects_require_authentication(client: TestClient) -> None:
    assert client.get(PROJECTS_URL).status_code == 401


def test_list_returns_only_the_callers_projects(
    client: TestClient, auth_headers: AuthHeaders
) -> None:
    owner = auth_headers()
    stranger = auth_headers("stranger@darukaa.earth")
    client.post(PROJECTS_URL, json=FOREST_PROJECT, headers=owner)
    client.post(PROJECTS_URL, json={**FOREST_PROJECT, "name": "Not yours"}, headers=stranger)

    names = [project["name"] for project in client.get(PROJECTS_URL, headers=owner).json()]

    assert names == [FOREST_PROJECT["name"]]


def test_another_owners_project_is_reported_as_missing(
    client: TestClient, auth_headers: AuthHeaders
) -> None:
    project_id = client.post(PROJECTS_URL, json=FOREST_PROJECT, headers=auth_headers()).json()["id"]
    stranger = auth_headers("stranger@darukaa.earth")

    assert client.get(f"{PROJECTS_URL}/{project_id}", headers=stranger).status_code == 404
    assert client.delete(f"{PROJECTS_URL}/{project_id}", headers=stranger).status_code == 404


def test_delete_project_removes_it(client: TestClient, auth_headers: AuthHeaders) -> None:
    headers = auth_headers()
    project_id = client.post(PROJECTS_URL, json=FOREST_PROJECT, headers=headers).json()["id"]

    assert client.delete(f"{PROJECTS_URL}/{project_id}", headers=headers).status_code == 204
    assert client.get(f"{PROJECTS_URL}/{project_id}", headers=headers).status_code == 404
