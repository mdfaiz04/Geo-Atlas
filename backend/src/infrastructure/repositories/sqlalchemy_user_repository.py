# Stores and reads users through SQLAlchemy.
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.domain.entities.user import User
from src.domain.repositories.user_repository import UserRepository
from src.infrastructure.database.models.user_model import UserModel


# Keeps the ORM row out of the domain by copying it into the entity.
def to_entity(model: UserModel) -> User:
    return User(
        id=model.id,
        email=model.email,
        full_name=model.full_name,
        password_hash=model.password_hash,
        created_at=model.created_at,
    )


class SqlAlchemyUserRepository(UserRepository):
    def __init__(self, session: Session) -> None:
        self._session = session

    def get_by_email(self, email: str) -> User | None:
        model = self._session.scalar(select(UserModel).where(UserModel.email == email))
        return to_entity(model) if model else None

    def get_by_id(self, user_id: UUID) -> User | None:
        model = self._session.get(UserModel, user_id)
        return to_entity(model) if model else None

    def add(self, email: str, full_name: str, password_hash: str) -> User:
        model = UserModel(email=email, full_name=full_name, password_hash=password_hash)
        self._session.add(model)
        self._session.flush()
        self._session.refresh(model)
        return to_entity(model)
