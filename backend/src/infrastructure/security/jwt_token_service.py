# Issues and reads the JSON Web Tokens used for authentication.
from datetime import UTC, datetime, timedelta

import jwt

from src.application.ports.token_service import TokenService
from src.domain.exceptions import InvalidTokenError
from src.infrastructure.config.settings import Settings

ACCESS_TOKEN = "access"
REFRESH_TOKEN = "refresh"


class JwtTokenService(TokenService):
    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    def create_access_token(self, subject: str) -> str:
        lifetime = timedelta(minutes=self._settings.access_token_expire_minutes)
        return self._encode(subject, ACCESS_TOKEN, lifetime)

    def create_refresh_token(self, subject: str) -> str:
        lifetime = timedelta(days=self._settings.refresh_token_expire_days)
        return self._encode(subject, REFRESH_TOKEN, lifetime)

    def read_subject(self, token: str) -> str:
        try:
            payload = jwt.decode(
                token, self._settings.jwt_secret_key, algorithms=[self._settings.jwt_algorithm]
            )
        except jwt.PyJWTError as error:
            raise InvalidTokenError from error
        subject = payload.get("sub")
        if payload.get("type") != ACCESS_TOKEN or not isinstance(subject, str):
            raise InvalidTokenError
        return subject

    def _encode(self, subject: str, token_type: str, lifetime: timedelta) -> str:
        issued_at = datetime.now(UTC)
        payload = {
            "sub": subject,
            "type": token_type,
            "iat": issued_at,
            "exp": issued_at + lifetime,
        }
        return jwt.encode(payload, self._settings.jwt_secret_key, self._settings.jwt_algorithm)
