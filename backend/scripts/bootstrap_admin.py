from argparse import ArgumentParser
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.db.session import SessionLocal
from app.models.enums import UserRole
from app.models.user import User
from app.services.auth_service import normalize_phone


def main() -> None:
    parser = ArgumentParser(description="Create or update an admin user for FarmHith backend")
    parser.add_argument("--phone", required=True, help="Admin phone number")
    parser.add_argument("--name", required=False, default="FarmHith Admin", help="Admin display name")
    args = parser.parse_args()

    normalized_phone = normalize_phone(args.phone)
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.phone == normalized_phone).first()
        if user:
            user.role = UserRole.ADMIN
            user.name = args.name
            db.add(user)
            db.commit()
            print(f"Updated existing user as admin: {user.id} ({user.phone})")
            return

        user = User(
            role=UserRole.ADMIN,
            phone=normalized_phone,
            name=args.name,
        )
        db.add(user)
        db.commit()
        print(f"Created new admin user: {user.id} ({user.phone})")
    finally:
        db.close()


if __name__ == "__main__":
    main()
