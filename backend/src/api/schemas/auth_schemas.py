# Request and response shapes for the authentication endpoints.
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from src.application.dto.auth_dto import AuthResult


class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=120)
    password: str = Field(min_length=8, max_length=72)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=72)


class UserResponse(BaseModel):
    id: UUID
    email: str
    full_name: str


class AuthResponse(BaseModel):
    user: UserResponse
    access_token: str
    refresh_token: str
    token_type: str

    @classmethod
    def from_result(cls, result: AuthResult) -> "AuthResponse":
        return cls(
            user=UserResponse(
                id=result.user.id, email=result.user.email, full_name=result.user.full_name
            ),
            access_token=result.tokens.access_token,
            refresh_token=result.tokens.refresh_token,
            token_type=result.tokens.token_type,
        )
