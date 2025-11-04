from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings."""
    
    # Application
    APP_NAME: str = "SportsPedia API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Fuseki Configuration
    FUSEKI_ENDPOINT: str = "http://localhost:3030/sportspedia/query"
    FUSEKI_UPDATE_ENDPOINT: str = "http://localhost:3030/sportspedia/update"
    FUSEKI_GRAPH_STORE: str = "http://localhost:3030/sportspedia/data"
    
    # Ontology
    ONTOLOGY_NAMESPACE: str = "http://example.org/sports-ontology#"
    
    # Ollama Configuration
    OLLAMA_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.2:3b"
    
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_RELOAD: bool = True
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
    ]
    
    # Database Configuration
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = ""
    DB_NAME: str = "sportspedia"
    
    # JWT Configuration
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()