"""
Create admin user in the database
"""
from sqlalchemy.orm import Session
from app.config.database import SessionLocal, engine, Base
from app.models.user import User
from app.utils.auth import get_password_hash

def create_admin_user():
    """Create admin user if not exists."""
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if admin exists
        admin = db.query(User).filter(User.username == "admin").first()
        
        if admin:
            print("Admin user already exists!")
            print(f"Username: {admin.username}")
            print(f"Email: {admin.email}")
            print(f"Is Admin: {admin.is_admin}")
            return
        
        # Create admin user
        admin_user = User(
            username="admin",
            email="admin@sportspedia.com",
            full_name="Administrator",
            hashed_password=get_password_hash("admin"),
            is_active=True,
            is_admin=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("✅ Admin user created successfully!")
        print(f"Username: admin")
        print(f"Password: admin")
        print(f"Email: {admin_user.email}")
        print(f"Is Admin: {admin_user.is_admin}")
        
    except Exception as e:
        print(f"Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
