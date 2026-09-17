# Imports every model so Alembic can discover the full schema.
from src.infrastructure.database.models.project_model import ProjectModel
from src.infrastructure.database.models.site_metric_model import SiteMetricModel
from src.infrastructure.database.models.site_model import SiteModel
from src.infrastructure.database.models.user_model import UserModel

__all__ = ["ProjectModel", "SiteMetricModel", "SiteModel", "UserModel"]
