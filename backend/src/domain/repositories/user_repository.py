# Contract for user persistence, kept in the domain so use cases never import SQLAlchemy.
from abc import ABC, abstractmethod
from uuid import UUID

from src.domain.entities.user import User


class UserRepository(ABC):
    @abstractmethod
    def get_by_email(self, email: str) -> User | None: ...

    @abstractmethod
    def get_by_id(self, user_id: UUID) -> User | None: ...

    @abstractmethod
    def add(self, email: str, full_name: str, password_hash: str) -> User: ...
