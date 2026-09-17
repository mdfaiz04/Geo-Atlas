# Builds and configures the FastAPI application.
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.error_handlers import register_error_handlers
from src.api.routers import auth_router, health_router
from src.infrastructure.config.settings import get_settings


# Assembles routers, middleware and error handling into a single application.
def create_app() -> FastAPI:
    settings = get_settings()
    application = FastAPI(
        title=settings.app_name,
        version="1.0.0",
        description="Geospatial analytics API for carbon and biodiversity projects",
    )
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    register_error_handlers(application)
    application.include_router(health_router.router)
    application.include_router(auth_router.router, prefix=settings.api_prefix)
    return application


app = create_app()
