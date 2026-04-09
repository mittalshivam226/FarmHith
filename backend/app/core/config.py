from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "FarmHith API"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    auto_create_tables: bool = True

    mysql_user: str = "root"
    mysql_password: str = ""
    mysql_host: str = "localhost"
    mysql_port: int = 3306
    mysql_db: str = "farmhith"

    razorpay_key_id: str = ""
    razorpay_key_secret: str = ""
    razorpay_webhook_secret: str = ""

    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_exp_minutes: int = 30
    jwt_refresh_token_exp_days: int = 14

    otp_secret_key: str = "change-me-otp-secret"
    otp_expiry_minutes: int = 5
    otp_max_attempts: int = 5
    otp_resend_cooldown_seconds: int = 60
    otp_mode: str = "console"  # console | provider
    otp_dev_static_code: str | None = None
    default_country_code: str = "+91"

    @property
    def mysql_url(self) -> str:
        return (
            f"mysql+pymysql://{self.mysql_user}:{self.mysql_password}"
            f"@{self.mysql_host}:{self.mysql_port}/{self.mysql_db}"
        )


settings = Settings()
