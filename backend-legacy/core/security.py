import os
from argon2 import PasswordHasher
import jwt
from datetime import datetime, timedelta, timezone

class PasswordManager:
    def __init__(self):
        self.ph = PasswordHasher()

    def hash_password(self, password: str) -> str:
        return self.ph.hash(password)

    def verify_password(self, provided_password: str, stored_hash: str) -> bool:
        try:
            return self.ph.verify(stored_hash, provided_password)
        except Exception as e:
            print(f"DEBUG ARGON2: Erro na verificação: {e}")
            return False


SECRET_TOKEN_KEY = os.getenv("SECRET_TOKEN_KEY")

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=1)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_TOKEN_KEY, algorithm="HS256")

def decode_access_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, SECRET_TOKEN_KEY, algorithms=["HS256"])
        if datetime.fromtimestamp(payload["exp"], tz=timezone.utc) < datetime.now(timezone.utc):
            return None
        return payload
    except jwt.PyJWTError:
        return None