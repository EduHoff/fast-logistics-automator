from domain.enums.user_role import UserRole

class User:
    def __init__(self, name: str, email: str, password: str, role: UserRole):
        self._name = name
        self._email = email
        self._password = password
        self._role = role

    @property
    def name(self) -> str:
        return self._name

    @name.setter
    def name(self, value: str):
        self._name = value

    @property
    def email(self) -> str:
        return self._email

    @email.setter
    def email(self, value: str):
        self._email = value

    @property
    def password(self) -> str:
        return self._password

    @password.setter
    def password(self, value: str):
        self._password = value

    @property
    def role(self) -> UserRole:
        return self._role

    @role.setter
    def role(self, value: UserRole):
        self._role = value

    def is_admin(self) -> bool:
        return self._role == UserRole.ADMIN

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "email": self.email,
            "password": "x",
            "role": str(self.role)
        }