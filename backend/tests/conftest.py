from datetime import datetime, timezone
from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient

from app.core.database import get_db
from app.main import app
from app.models.brew import Brew


@pytest.fixture
def mock_db():
    """Creates a mock database session"""
    mock = MagicMock()

    # Configure mock to return a Brew instance when refresh is called
    def refresh_mock(x):
        if isinstance(x, Brew):
            x.id = 1
            x.created_at = datetime.now(timezone.utc)

    mock.refresh.side_effect = refresh_mock
    return mock


@pytest.fixture
def client(mock_db):
    """Test client with mocked database"""

    def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c
    # Clean up
    app.dependency_overrides.clear()
