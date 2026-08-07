from abc import ABC, abstractmethod

class ScannerInterface(ABC):

    @abstractmethod
    def scan(self, file_content: bytes, created_by_id: str):
        pass