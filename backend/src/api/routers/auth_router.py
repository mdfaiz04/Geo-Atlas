# Registration, login and current-user endpoints.
from fastapi import APIRouter, status

from src.api.dependencies.auth import AuthenticateUserDep, CurrentUserDep, RegisterUserDep
from src.api.schemas.auth_schemas import AuthResponse, LoginRequest, RegisterRequest, UserResponse
from src.application.dto.auth_dto import LoginCommand, RegisterCommand

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, register_user: RegisterUserDep) -> AuthResponse:
    command = RegisterCommand(
        email=payload.email, full_name=payload.full_name, password=payload.password
    )
    return AuthResponse.from_result(register_user.execute(command))


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, authenticate_user: AuthenticateUserDep) -> AuthResponse:
    command = LoginCommand(email=payload.email, password=payload.password)
    return AuthResponse.from_result(authenticate_user.execute(command))


@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: CurrentUserDep) -> UserResponse:
    return UserResponse(
        id=current_user.id, email=current_user.email, full_name=current_user.full_name
    )
