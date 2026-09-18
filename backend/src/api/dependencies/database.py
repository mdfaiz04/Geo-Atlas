# Request-scoped database session and application settings.
from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from src.infrastructure.config.settings import Settings, get_settings
from src.infrastructure.database.session import get_session

SessionDep = Annotated[Session, Depends(get_session)]
SettingsDep = Annotated[Settings, Depends(get_settings)]
