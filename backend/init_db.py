"""
Database initialization script.
Run this to create the database tables.
"""
from app.config.database import Base, engine
from app.models.user import User

def init_db():
    """Initialize the database."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()
