import os
import sys

# Add backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.models.user import User
from app.models.enums import UserRole
from sqlalchemy import select

def seed_users():
    with SessionLocal() as session:
        test_profiles = [
            {
                "phone": "+919999999991",
                "name": "Test Farmer",
                "role": UserRole.FARMER,
                "village": "Greenville",
                "district": "Agriward",
                "state": "Punjab"
            },
            {
                "phone": "+919999999992",
                "name": "Test Lab",
                "role": UserRole.LAB,
                "address": "123 Science Park, Tech City",
                "state": "Punjab"
            },
            {
                "phone": "+919999999993",
                "name": "Test Buyer (Bio-Pellet Plant)",
                "role": UserRole.BUYER,
                "address": "Industrial Area, Phase 1",
                "state": "Haryana"
            }
        ]
        
        roles_inserted = []

        for profile in test_profiles:
            existing = session.query(User).filter(User.phone == profile["phone"]).first()
            
            if not existing:
                user = User(**profile)
                session.add(user)
                roles_inserted.append(f"{profile['name']} ({profile['phone']}) - Role: {profile['role'].value}")
        
        session.commit()
        
        if roles_inserted:
            print("Successfully inserted the following test users:")
            for p in roles_inserted:
                print(f" - {p}")
        else:
            print("Test users already exist in the database.")
            for p in test_profiles:
                print(f" - {p['name']} ({p['phone']}) - Role: {p['role'].value}")

if __name__ == "__main__":
    seed_users()
