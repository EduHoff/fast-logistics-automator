from enum import Enum

class Category(str, Enum):
    LSG = "LSG"
    MOBILIAS = "MOBILIAS"
    RACK_SLIM = "RACK_SLIM"
    CHECKOUTS = "CHECKOUTS"
    PORTA_PALLETS = "PORTA_PALLETS"
    REFRIGERATED = "REFRIGERATED"

    def __str__(self):
        return self.value

class AssemblyStatus(str, Enum):
    MONTADO = "MONTADO"
    DESMONTADO = "DESMONTADO"

    def __str__(self):
        return self.value