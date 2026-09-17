# Data carried in and out of the authentication use cases.
from dataclasses import dataclass
from uuid import UUID


@dataclass(frozen=True, slots=True)
class RegisterCommand:
    email: str
    full_name: str
    password: str


@dataclass(frozen=True, slots=True)
class LoginCommand:
    email: str
    password: str


@dataclass(frozen=True, slots=True)
class AuthenticatedUser:
    id: UUID
    email: str
    full_name: str


@dataclass(frozen=True, slots=True)
class AuthTokens:
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


@dataclass(frozen=True, slots=True)
class AuthResult:
    user: AuthenticatedUser
    tokens: AuthTokens
