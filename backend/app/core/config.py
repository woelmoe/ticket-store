from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # ─── Вместимость ───
    TOTAL_CAPACITY: int = 100

    # ─── Возрастные ограничения ───
    ADULT_MIN_AGE: int = 18
    CHILD_MAX_AGE: int = 17  # младше 18 — ребёнок
    MIN_ADULT_AGE_FOR_CHILD: int = 18  # взрослый, сопровождающий ребёнка

    # ─── Тарифы ───
    ADULT_PRICE: float = 1500.0
    CHILD_PRICE: float = 750.0

    # ─── CORS ───
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]


settings = Settings()
