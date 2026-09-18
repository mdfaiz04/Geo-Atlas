# Translates domain errors into HTTP responses.
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from src.domain.exceptions import (
    DomainError,
    EmailAlreadyRegisteredError,
    InvalidCredentialsError,
    InvalidGeometryError,
    InvalidTokenError,
    ProjectNotFoundError,
    SiteNotFoundError,
    UserNotFoundError,
)

STATUS_BY_ERROR: dict[type[DomainError], int] = {
    EmailAlreadyRegisteredError: status.HTTP_409_CONFLICT,
    InvalidCredentialsError: status.HTTP_401_UNAUTHORIZED,
    InvalidTokenError: status.HTTP_401_UNAUTHORIZED,
    UserNotFoundError: status.HTTP_404_NOT_FOUND,
    ProjectNotFoundError: status.HTTP_404_NOT_FOUND,
    SiteNotFoundError: status.HTTP_404_NOT_FOUND,
    InvalidGeometryError: status.HTTP_422_UNPROCESSABLE_ENTITY,
}


# Registers a single handler so every domain error maps to a predictable status code.
def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(DomainError)
    async def handle_domain_error(_request: Request, error: DomainError) -> JSONResponse:
        status_code = STATUS_BY_ERROR.get(type(error), status.HTTP_400_BAD_REQUEST)
        return JSONResponse(status_code=status_code, content={"detail": str(error)})
