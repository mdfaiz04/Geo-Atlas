# Contract for storing sites and reading them back with their boundaries.
from abc import ABC, abstractmethod
from uuid import UUID

from src.domain.entities.site import Site
from src.domain.value_objects.polygon import Polygon


class SiteRepository(ABC):
    @abstractmethod
    def add(self, project_id: UUID, name: str, boundary: Polygon) -> Site: ...

    @abstractmethod
    def get_owned(self, site_id: UUID, owner_id: UUID) -> Site | None: ...

    @abstractmethod
    def list_for_project(self, project_id: UUID) -> list[Site]: ...

    @abstractmethod
    def list_for_owner(self, owner_id: UUID) -> list[Site]: ...

    @abstractmethod
    def delete(self, site_id: UUID) -> None: ...
