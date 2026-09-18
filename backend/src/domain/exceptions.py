# Errors the domain raises so the API layer never leaks database or framework details.


class DomainError(Exception):
    pass


class EmailAlreadyRegisteredError(DomainError):
    def __init__(self, email: str) -> None:
        super().__init__(f"An account already exists for {email}")


class InvalidCredentialsError(DomainError):
    def __init__(self) -> None:
        super().__init__("Incorrect email or password")


class UserNotFoundError(DomainError):
    def __init__(self) -> None:
        super().__init__("User not found")


class InvalidTokenError(DomainError):
    def __init__(self) -> None:
        super().__init__("Token is invalid or has expired")


class ProjectNotFoundError(DomainError):
    def __init__(self) -> None:
        super().__init__("Project not found")


class SiteNotFoundError(DomainError):
    def __init__(self) -> None:
        super().__init__("Site not found")


class InvalidGeometryError(DomainError):
    def __init__(self, reason: str) -> None:
        super().__init__(f"Invalid site boundary: {reason}")


class OverlappingSiteError(DomainError):
    def __init__(self, existing_site_name: str) -> None:
        super().__init__(
            f"This boundary overlaps the existing site '{existing_site_name}'. "
            "Sites in one project cannot share land, or its area would be counted twice."
        )
