# Verifies credentials and issues a fresh pair of tokens.
from src.application.dto.auth_dto import AuthResult, LoginCommand
from src.application.ports.password_hasher import PasswordHasher
from src.application.services.token_issuer import TokenIssuer
from src.domain.exceptions import InvalidCredentialsError
from src.domain.repositories.user_repository import UserRepository


class AuthenticateUser:
    def __init__(self, users: UserRepository, hasher: PasswordHasher, issuer: TokenIssuer) -> None:
        self._users = users
        self._hasher = hasher
        self._issuer = issuer

    def execute(self, command: LoginCommand) -> AuthResult:
        user = self._users.get_by_email(command.email.strip().lower())
        if user is None or not self._hasher.verify(command.password, user.password_hash):
            raise InvalidCredentialsError
        return self._issuer.issue(user)
