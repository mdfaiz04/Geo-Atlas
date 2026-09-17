# The user who owns projects in the platform.
from dataclasses import dataclass
from datetime import datetime
from uuid import UUID


@dataclass(frozen=True, slots=True)
class User:
    id: UUID
    email: str
    full_name: str
    password_hash: str
    created_at: datetime
