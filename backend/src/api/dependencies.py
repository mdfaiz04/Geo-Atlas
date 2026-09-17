# Wires concrete implementations into the use cases for every request.
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from src.application.dto.auth_dto import AuthenticatedUser
from src.application.ports.password_hasher import PasswordHasher
from src.application.ports.token_service import TokenService
from src.application.services.token_issuer import TokenIssuer
from src.application.use_cases.authenticate_user import AuthenticateUser
from src.application.use_cases.get_authenticated_user import GetAuthenticatedUser
from src.application.use_cases.register_user import RegisterUser
from src.domain.repositories.user_repository import UserRepository
from src.infrastructure.config.settings import Settings, get_settings
from src.infrastructure.database.session import get_session
from src.infrastructure.repositories.sqlalchemy_user_repository import SqlAlchemyUserRepository
from src.infrastructure.security.bcrypt_password_hasher import BcryptPasswordHasher
from src.infrastructure.security.jwt_token_service import JwtTokenService

bearer_scheme = HTTPBearer(auto_error=False)

SessionDep = Annotated[Session, Depends(get_session)]
SettingsDep = Annotated[Settings, Depends(get_settings)]


def get_user_repository(session: SessionDep) -> UserRepository:
    return SqlAlchemyUserRepository(session)


def get_password_hasher() -> PasswordHasher:
    return BcryptPasswordHasher()


def get_token_service(settings: SettingsDep) -> TokenService:
    return JwtTokenService(settings)


UserRepositoryDep = Annotated[UserRepository, Depends(get_user_repository)]
PasswordHasherDep = Annotated[PasswordHasher, Depends(get_password_hasher)]
TokenServiceDep = Annotated[TokenService, Depends(get_token_service)]


def get_token_issuer(tokens: TokenServiceDep) -> TokenIssuer:
    return TokenIssuer(tokens)


TokenIssuerDep = Annotated[TokenIssuer, Depends(get_token_issuer)]


def get_register_user(
    users: UserRepositoryDep, hasher: PasswordHasherDep, issuer: TokenIssuerDep
) -> RegisterUser:
    return RegisterUser(users, hasher, issuer)


def get_authenticate_user(
    users: UserRepositoryDep, hasher: PasswordHasherDep, issuer: TokenIssuerDep
) -> AuthenticateUser:
    return AuthenticateUser(users, hasher, issuer)


# Reads the bearer token from the request and resolves the signed-in user.
def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    users: UserRepositoryDep,
    tokens: TokenServiceDep,
) -> AuthenticatedUser:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return GetAuthenticatedUser(users, tokens).execute(credentials.credentials)


RegisterUserDep = Annotated[RegisterUser, Depends(get_register_user)]
AuthenticateUserDep = Annotated[AuthenticateUser, Depends(get_authenticate_user)]
CurrentUserDep = Annotated[AuthenticatedUser, Depends(get_current_user)]
