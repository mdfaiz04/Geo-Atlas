# Creates an account and signs the new user in immediately.
from src.application.dto.auth_dto import AuthResult, RegisterCommand
from src.application.ports.password_hasher import PasswordHasher
from src.application.services.token_issuer import TokenIssuer
from src.domain.exceptions import EmailAlreadyRegisteredError
from src.domain.repositories.user_repository import UserRepository


class RegisterUser:
    def __init__(self, users: UserRepository, hasher: PasswordHasher, issuer: TokenIssuer) -> None:
        self._users = users
        self._hasher = hasher
        self._issuer = issuer

    def execute(self, command: RegisterCommand) -> AuthResult:
        email = command.email.strip().lower()
        if self._users.get_by_email(email) is not None:
            raise EmailAlreadyRegisteredError(email)
        user = self._users.add(
            email=email,
            full_name=command.full_name.strip(),
            password_hash=self._hasher.hash(command.password),
        )
        return self._issuer.issue(user)
