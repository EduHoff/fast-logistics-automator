from enum import Enum

class UnitType(str, Enum):
    PC = "PC"
    CJ = "CJ"

    def __str__(self):
        return self.value