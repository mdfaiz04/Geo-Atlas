# Removes a site the administrator owns.
from uuid import UUID

from src.domain.exceptions import SiteNotFoundError
from src.domain.repositories.site_repository import SiteRepository


class DeleteSite:
    def __init__(self, sites: SiteRepository) -> None:
        self._sites = sites

    def execute(self, site_id: UUID, owner_id: UUID) -> None:
        if self._sites.get_owned(site_id, owner_id) is None:
            raise SiteNotFoundError
        self._sites.delete(site_id)
