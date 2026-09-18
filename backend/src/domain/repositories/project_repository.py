# Contract for storing projects and reading their portfolio summaries.
from abc import ABC, abstractmethod
from uuid import UUID

from src.domain.entities.project import Project, ProjectSummary, ProjectType


class ProjectRepository(ABC):
    @abstractmethod
    def add(
        self, owner_id: UUID, name: str, description: str | None, project_type: ProjectType
    ) -> Project: ...

    @abstractmethod
    def get_owned(self, project_id: UUID, owner_id: UUID) -> Project | None: ...

    @abstractmethod
    def get_summary(self, project_id: UUID, owner_id: UUID) -> ProjectSummary | None: ...

    @abstractmethod
    def list_summaries(self, owner_id: UUID) -> list[ProjectSummary]: ...

    @abstractmethod
    def delete(self, project_id: UUID) -> None: ...
