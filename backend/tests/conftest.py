# Fixtures that exercise the API against a real PostGIS database.
import os
from collections.abc import Iterator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import NullPool

BACKEND_DIR = Path(__file__).resolve().parents[1]
TEST_DATABASE_NAME = "darukaa_test"
ADMIN_DATABASE_URL = os.environ.get(
    "ADMIN_DATABASE_URL", "postgresql://darukaa:darukaa@localhost:5432/postgres"
)
TEST_DATABASE_URL = os.environ.get(
    "TEST_DATABASE_URL", f"postgresql://darukaa:darukaa@localhost:5432/{TEST_DATABASE_NAME}"
)

os.environ["DATABASE_URL"] = TEST_DATABASE_URL
os.environ.setdefault("JWT_SECRET_KEY", "pytest-secret-key-with-more-than-32-characters")
os.environ.setdefault("ENVIRONMENT", "test")

from alembic import command  # noqa: E402
from alembic.config import Config  # noqa: E402
from src.infrastructure.database.session import get_session  # noqa: E402
from src.main import app  # noqa: E402


# Creates the dedicated test database the first time the suite runs.
def create_test_database() -> None:
    engine = create_engine(ADMIN_DATABASE_URL, isolation_level="AUTOCOMMIT", poolclass=NullPool)
    with engine.connect() as connection:
        exists = connection.scalar(
            text("SELECT 1 FROM pg_database WHERE datname = :name"), {"name": TEST_DATABASE_NAME}
        )
        if not exists:
            connection.execute(text(f'CREATE DATABASE "{TEST_DATABASE_NAME}"'))
    engine.dispose()


@pytest.fixture(scope="session", autouse=True)
def migrated_database() -> None:
    create_test_database()
    config = Config(str(BACKEND_DIR / "alembic.ini"))
    config.set_main_option("script_location", str(BACKEND_DIR / "alembic"))
    command.upgrade(config, "head")


@pytest.fixture
def db_session() -> Iterator[Session]:
    engine = create_engine(TEST_DATABASE_URL, poolclass=NullPool)
    connection = engine.connect()
    transaction = connection.begin()
    factory = sessionmaker(
        bind=connection, join_transaction_mode="create_savepoint", expire_on_commit=False
    )
    session = factory()
    yield session
    session.close()
    transaction.rollback()
    connection.close()
    engine.dispose()


@pytest.fixture
def client(db_session: Session) -> Iterator[TestClient]:
    app.dependency_overrides[get_session] = lambda: db_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
