# Checks the demo portfolio seeds once and is usable through the API straight away.
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from src.cli.demo_portfolio import DEMO_PORTFOLIO
from src.cli.seed_demo import DEMO_EMAIL, DEMO_PASSWORD, seed_demo_portfolio
from src.infrastructure.config.settings import get_settings


def test_seeding_only_happens_once(db_session: Session) -> None:
    assert seed_demo_portfolio(db_session, get_settings()) is True
    assert seed_demo_portfolio(db_session, get_settings()) is False


def test_demo_account_signs_in_to_a_full_portfolio(client: TestClient, db_session: Session) -> None:
    seed_demo_portfolio(db_session, get_settings())

    login = client.post("/api/v1/auth/login", json={"email": DEMO_EMAIL, "password": DEMO_PASSWORD})
    headers = {"Authorization": f"Bearer {login.json()['access_token']}"}
    projects = client.get("/api/v1/projects", headers=headers).json()
    sites = client.get("/api/v1/sites", headers=headers).json()["features"]

    assert sorted(project["name"] for project in projects) == sorted(
        demo.name for demo in DEMO_PORTFOLIO
    )
    assert len(sites) == sum(len(demo.sites) for demo in DEMO_PORTFOLIO)
    assert all(100 < site["properties"]["area_hectares"] < 1000 for site in sites)


def test_every_demo_site_has_analytics(client: TestClient, db_session: Session) -> None:
    seed_demo_portfolio(db_session, get_settings())
    login = client.post("/api/v1/auth/login", json={"email": DEMO_EMAIL, "password": DEMO_PASSWORD})
    headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

    for site in client.get("/api/v1/sites", headers=headers).json()["features"]:
        analytics = client.get(f"/api/v1/sites/{site['id']}/analytics", headers=headers).json()
        assert all(len(series["points"]) == 36 for series in analytics["series"])
