# Covers the registration, login and profile flow end to end.
from fastapi.testclient import TestClient

REGISTER_URL = "/api/v1/auth/register"
LOGIN_URL = "/api/v1/auth/login"
ME_URL = "/api/v1/auth/me"

CREDENTIALS = {
    "email": "admin@darukaa.earth",
    "full_name": "Darukaa Administrator",
    "password": "StrongPassword123",
}


# Registers the default account and hands back the parsed response body.
def register_account(client: TestClient, **overrides: str) -> dict:
    payload = {**CREDENTIALS, **overrides}
    return client.post(REGISTER_URL, json=payload).json()


def test_register_creates_account_and_returns_tokens(client: TestClient) -> None:
    response = client.post(REGISTER_URL, json=CREDENTIALS)

    assert response.status_code == 201
    body = response.json()
    assert body["user"]["email"] == CREDENTIALS["email"]
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["refresh_token"]


def test_register_rejects_duplicate_email(client: TestClient) -> None:
    client.post(REGISTER_URL, json=CREDENTIALS)

    response = client.post(REGISTER_URL, json=CREDENTIALS)

    assert response.status_code == 409


def test_register_rejects_weak_password(client: TestClient) -> None:
    response = client.post(REGISTER_URL, json={**CREDENTIALS, "password": "short"})

    assert response.status_code == 422


def test_login_returns_tokens_for_valid_credentials(client: TestClient) -> None:
    client.post(REGISTER_URL, json=CREDENTIALS)

    response = client.post(
        LOGIN_URL, json={"email": CREDENTIALS["email"], "password": CREDENTIALS["password"]}
    )

    assert response.status_code == 200
    assert response.json()["access_token"]


def test_login_rejects_wrong_password(client: TestClient) -> None:
    client.post(REGISTER_URL, json=CREDENTIALS)

    response = client.post(
        LOGIN_URL, json={"email": CREDENTIALS["email"], "password": "WrongPassword123"}
    )

    assert response.status_code == 401


def test_login_rejects_unknown_email(client: TestClient) -> None:
    response = client.post(
        LOGIN_URL, json={"email": "nobody@darukaa.earth", "password": "StrongPassword123"}
    )

    assert response.status_code == 401


def test_me_returns_the_signed_in_user(client: TestClient) -> None:
    token = register_account(client)["access_token"]

    response = client.get(ME_URL, headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    assert response.json()["email"] == CREDENTIALS["email"]


def test_me_requires_a_token(client: TestClient) -> None:
    response = client.get(ME_URL)

    assert response.status_code == 401


def test_me_rejects_a_tampered_token(client: TestClient) -> None:
    response = client.get(ME_URL, headers={"Authorization": "Bearer not-a-real-token"})

    assert response.status_code == 401


def test_email_is_stored_in_lowercase(client: TestClient) -> None:
    body = register_account(client, email="Mixed.Case@Darukaa.Earth")

    assert body["user"]["email"] == "mixed.case@darukaa.earth"
