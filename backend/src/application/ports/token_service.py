# Contract for issuing and reading access tokens.
from abc import ABC, abstractmethod


class TokenService(ABC):
    @abstractmethod
    def create_access_token(self, subject: str) -> str: ...

    @abstractmethod
    def create_refresh_token(self, subject: str) -> str: ...

    @abstractmethod
    def read_subject(self, token: str) -> str: ...
