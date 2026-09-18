# Creates a new project for the signed-in administrator.
from decimal import Decimal

from src.application.dto.project_dto import CreateProjectCommand
from src.domain.entities.project import ProjectSummary
from src.domain.repositories.project_repository import ProjectRepository


class CreateProject:
    def __init__(self, projects: ProjectRepository) -> None:
        self._projects = projects

    def execute(self, command: CreateProjectCommand) -> ProjectSummary:
        project = self._projects.add(
            owner_id=command.owner_id,
            name=command.name,
            description=command.description,
            project_type=command.project_type,
        )
        return ProjectSummary(project=project, site_count=0, total_area_hectares=Decimal(0))
