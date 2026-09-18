# Endpoints for creating, listing, viewing and deleting projects.
from uuid import UUID

from fastapi import APIRouter, status

from src.api.dependencies.auth import CurrentUserDep
from src.api.dependencies.projects import (
    CreateProjectDep,
    DeleteProjectDep,
    GetProjectDep,
    ListProjectsDep,
)
from src.api.schemas.project_schemas import CreateProjectRequest, ProjectResponse
from src.application.dto.project_dto import CreateProjectCommand

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=list[ProjectResponse])
def list_projects(current_user: CurrentUserDep, use_case: ListProjectsDep) -> list[ProjectResponse]:
    return [ProjectResponse.from_summary(summary) for summary in use_case.execute(current_user.id)]


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: CreateProjectRequest, current_user: CurrentUserDep, use_case: CreateProjectDep
) -> ProjectResponse:
    command = CreateProjectCommand(
        owner_id=current_user.id,
        name=payload.name,
        description=payload.description or None,
        project_type=payload.project_type,
    )
    return ProjectResponse.from_summary(use_case.execute(command))


@router.get("/{project_id}", response_model=ProjectResponse)
def read_project(
    project_id: UUID, current_user: CurrentUserDep, use_case: GetProjectDep
) -> ProjectResponse:
    return ProjectResponse.from_summary(use_case.execute(project_id, current_user.id))


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: UUID, current_user: CurrentUserDep, use_case: DeleteProjectDep
) -> None:
    use_case.execute(project_id, current_user.id)
