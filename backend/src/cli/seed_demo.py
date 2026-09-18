# Creates the demo account and portfolio through the normal use cases, so every rule applies.
from sqlalchemy.orm import Session

from src.application.dto.auth_dto import RegisterCommand
from src.application.dto.project_dto import CreateProjectCommand
from src.application.dto.site_dto import CreateSiteCommand
from src.application.services.token_issuer import TokenIssuer
from src.application.use_cases.create_project import CreateProject
from src.application.use_cases.create_site import CreateSite
from src.application.use_cases.register_user import RegisterUser
from src.cli.boundaries import boundary_around
from src.cli.demo_portfolio import DEMO_PORTFOLIO
from src.infrastructure.analytics.simulated_metrics_source import SimulatedMetricsSource
from src.infrastructure.config.settings import Settings, get_settings
from src.infrastructure.database.session import get_session_factory
from src.infrastructure.repositories.sqlalchemy_project_repository import (
    SqlAlchemyProjectRepository,
)
from src.infrastructure.repositories.sqlalchemy_site_metric_repository import (
    SqlAlchemySiteMetricRepository,
)
from src.infrastructure.repositories.sqlalchemy_site_repository import SqlAlchemySiteRepository
from src.infrastructure.repositories.sqlalchemy_user_repository import SqlAlchemyUserRepository
from src.infrastructure.security.bcrypt_password_hasher import BcryptPasswordHasher
from src.infrastructure.security.jwt_token_service import JwtTokenService

DEMO_EMAIL = "demo@darukaa.earth"
DEMO_PASSWORD = "DarukaaDemo2026"
DEMO_NAME = "Demo Administrator"


# Seeds the portfolio once and reports whether anything was created.
def seed_demo_portfolio(session: Session, settings: Settings) -> bool:
    users = SqlAlchemyUserRepository(session)
    if users.get_by_email(DEMO_EMAIL) is not None:
        return False
    register = RegisterUser(users, BcryptPasswordHasher(), TokenIssuer(JwtTokenService(settings)))
    owner = register.execute(
        RegisterCommand(email=DEMO_EMAIL, full_name=DEMO_NAME, password=DEMO_PASSWORD)
    ).user
    projects = SqlAlchemyProjectRepository(session)
    create_project = CreateProject(projects)
    create_site = CreateSite(
        projects,
        SqlAlchemySiteRepository(session),
        SqlAlchemySiteMetricRepository(session),
        SimulatedMetricsSource(),
    )
    for demo in DEMO_PORTFOLIO:
        project = create_project.execute(
            CreateProjectCommand(
                owner_id=owner.id,
                name=demo.name,
                description=demo.description,
                project_type=demo.project_type,
            )
        ).project
        for site in demo.sites:
            boundary = boundary_around(site.longitude, site.latitude, site.radius_km, site.name)
            create_site.execute(
                CreateSiteCommand(
                    owner_id=owner.id, project_id=project.id, name=site.name, boundary=boundary
                )
            )
    return True


def main() -> None:
    with get_session_factory()() as session:
        created = seed_demo_portfolio(session, get_settings())
        session.commit()
    status = "created" if created else "already present"
    print(f"Demo portfolio {status} for {DEMO_EMAIL}")


if __name__ == "__main__":
    main()
