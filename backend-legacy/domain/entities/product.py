from domain.enums.unit_type import UnitType
from domain.enums.category import Category

class Product:
    def __init__(
        self, 
        code: str, 
        description: str, 
        quantity: int, 
        unit: UnitType, 
        category: Category,
        items_per_m3: float = 0.0,  # Qtd/m3 (Method A)
        length: float = 0.0,          # (Method B)
        width: float = 0.0,           # (Method B)
        height: float = 0.0           # (Method B)
    ):
        self._code = code
        self._description = description
        self._quantity = quantity
        self._unit = unit
        self._category = category
        self._items_per_m3 = items_per_m3
        self._length = length
        self._width = width
        self._height = height

    @property
    def code(self): return self._code

    @code.setter
    def code(self, value: str):
        self._code = value
    
    @property
    def description(self): return self._description

    @description.setter
    def description(self, value: str):
        self._description = value
    
    @property
    def quantity(self): return self._quantity

    @quantity.setter
    def quantity(self, value):
        if value < 0:
            raise ValueError("Quantity cannot be negative")
        self._quantity = value
    
    @property
    def unit(self): return self._unit

    @unit.setter
    def unit(self, value: UnitType):
        self._unit = value
    
    @property
    def category(self): return self._category

    @category.setter
    def category(self, value: Category):
        self._category = value

    @property
    def items_per_m3(self): return self._items_per_m3

    @items_per_m3.setter
    def items_per_m3(self, value: float):
        self._items_per_m3 = value
    
    @property
    def length(self): return self._length

    @length.setter
    def length(self, value: float):
        self._length = value

    @property
    def width(self): return self._width

    @width.setter
    def width(self, value: float):
        self._width = value

    @property
    def height(self): return self._height

    @height.setter
    def height(self, value: float):
        self._height = value
