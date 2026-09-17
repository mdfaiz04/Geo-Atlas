# Resolves the user behind an access token for protected endpoints.
from uuid import UUID

from src.application.dto.auth_dto import AuthenticatedUser
from src.application.ports.token_service import TokenService
from src.domain.exceptions import InvalidTokenError
from src.domain.repositories.user_repository import UserRepository


class GetAuthenticatedUser:
    def __init__(self, users: UserRepository, tokens: TokenService) -> None:
        self._users = users
        self._tokens = tokens

    def execute(self, token: str) -> AuthenticatedUser:
        subject = self._tokens.read_subject(token)
        try:
            user_id = UUID(subject)
        except ValueError as error:
            raise InvalidTokenError from error
        user = self._users.get_by_id(user_id)
        if user is None:
            raise InvalidTokenError
        return AuthenticatedUser(id=user.id, email=user.email, full_name=user.full_name)
