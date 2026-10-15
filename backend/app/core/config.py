import json
from functools import lru_cache
from typing import Any, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    gemini_api_key: str = ""
    gemini_model: str = "gemini-3-flash-preview"
    allowed_origins: Union[list[str], str] = ["http://localhost:3000"]
    max_upload_size_mb: int = 10
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v: Any) -> list[str]:
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                try:
                    parsed = json.loads(v)
                    if isinstance(parsed, list):
                        return [str(o).strip() for o in parsed if str(o).strip()]
                except Exception:
                    pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        if isinstance(v, list):
            return [str(o).strip() for o in v if str(o).strip()]
        return ["http://localhost:3000"]

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
