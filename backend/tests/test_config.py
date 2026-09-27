import importlib

import dotenv
import pytest

from app.core import config


@pytest.fixture
def reload_config(monkeypatch):
    monkeypatch.setattr(dotenv, "load_dotenv", lambda *args, **kwargs: False)  # ignore any local .env
    yield lambda: importlib.reload(config)
    monkeypatch.undo()
    importlib.reload(config)


def test_settings_default_to_a_local_setup(monkeypatch, reload_config):
    for var in ("MONGO_URI", "DATABASE_NAME", "CORS_ORIGINS"):
        monkeypatch.delenv(var, raising=False)

    settings = reload_config()

    assert settings.MONGO_URI == "mongodb://localhost:27017"
    assert settings.DATABASE_NAME == "api_endpoint_testing"
    assert settings.CORS_ORIGINS == ["http://localhost:3000", "http://127.0.0.1:3000"]


def test_settings_are_read_from_the_environment(monkeypatch, reload_config):
    monkeypatch.setenv("MONGO_URI", "mongodb://mongo:27017")
    monkeypatch.setenv("DATABASE_NAME", "monitoring")
    monkeypatch.setenv("CORS_ORIGINS", "https://app.example.com, https://admin.example.com,")

    settings = reload_config()

    assert settings.MONGO_URI == "mongodb://mongo:27017"
    assert settings.DATABASE_NAME == "monitoring"
    assert settings.CORS_ORIGINS == ["https://app.example.com", "https://admin.example.com"]
