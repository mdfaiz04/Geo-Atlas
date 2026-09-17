# Turns a domain user into the authenticated payload the API hands back.
from src.application.dto.auth_dto import AuthenticatedUser, AuthResult, AuthTokens
from src.application.ports.token_service import TokenService
from src.domain.entities.user import User


class TokenIssuer:
    def __init__(self, tokens: TokenService) -> None:
        self._tokens = tokens

    def issue(self, user: User) -> AuthResult:
        subject = str(user.id)
        return AuthResult(
            user=AuthenticatedUser(id=user.id, email=user.email, full_name=user.full_name),
            tokens=AuthTokens(
                access_token=self._tokens.create_access_token(subject),
                refresh_token=self._tokens.create_refresh_token(subject),
            ),
        )
