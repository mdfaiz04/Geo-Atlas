# Wires the project repository into the project use cases.
from typing import Annotated

from fastapi import Depends

from src.api.dependencies.database import SessionDep
from src.application.use_cases.create_project import CreateProject
from src.application.use_cases.delete_project import DeleteProject
from src.application.use_cases.get_project import GetProject
from src.application.use_cases.list_projects import ListProjects
from src.domain.repositories.project_repository import ProjectRepository
from src.infrastructure.repositories.sqlalchemy_project_repository import (
    SqlAlchemyProjectRepository,
)


def get_project_repository(session: SessionDep) -> ProjectRepository:
    return SqlAlchemyProjectRepository(session)


ProjectRepositoryDep = Annotated[ProjectRepository, Depends(get_project_repository)]


def get_create_project(projects: ProjectRepositoryDep) -> CreateProject:
    return CreateProject(projects)


def get_list_projects(projects: ProjectRepositoryDep) -> ListProjects:
    return ListProjects(projects)


def get_get_project(projects: ProjectRepositoryDep) -> GetProject:
    return GetProject(projects)


def get_delete_project(projects: ProjectRepositoryDep) -> DeleteProject:
    return DeleteProject(projects)


CreateProjectDep = Annotated[CreateProject, Depends(get_create_project)]
ListProjectsDep = Annotated[ListProjects, Depends(get_list_projects)]
GetProjectDep = Annotated[GetProject, Depends(get_get_project)]
DeleteProjectDep = Annotated[DeleteProject, Depends(get_delete_project)]
