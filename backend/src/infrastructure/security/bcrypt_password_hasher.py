# Hashes and verifies passwords with bcrypt.
import bcrypt

from src.application.ports.password_hasher import PasswordHasher

ENCODING = "utf-8"


class BcryptPasswordHasher(PasswordHasher):
    def hash(self, plain_password: str) -> str:
        digest = bcrypt.hashpw(plain_password.encode(ENCODING), bcrypt.gensalt())
        return digest.decode(ENCODING)

    def verify(self, plain_password: str, password_hash: str) -> bool:
        try:
            return bcrypt.checkpw(plain_password.encode(ENCODING), password_hash.encode(ENCODING))
        except ValueError:
            return False
