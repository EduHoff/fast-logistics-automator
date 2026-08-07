from enum import Enum

class VehicleType(str, Enum):
    TRUCK = "Truck"
    CARRETA = "Carreta"

    def __str__(self):
        return self.value