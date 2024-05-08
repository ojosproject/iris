# Medications.py
# Ojos Project
#
# This file will include medication-related material.

from main import DB
import time


class Medication:
    def __init__(self, name: str, brand: str, dosage: float, supply: float = None, first_added: float = None, last_taken: float = None):
        self._name = name
        self._brand = brand
        self._dosage = dosage
        self._supply = supply
        self._first_added = first_added
        self._last_taken = last_taken

    @property
    def name(self) -> str:
        return self._name

    @property
    def brand(self) -> str:
        return self._brand

    @property
    def dosage(self) -> float:
        return self._dosage

    @dosage.setter
    def dosage(self, value: float) -> None:
        ...  # todo: run checks, ensure it's a valid value
        self._dosage = value
        DB.set_medication_dosage(self._name, self._dosage)

    @property
    def supply(self) -> float:
        return self._supply

    @supply.setter
    def supply(self, value: float) -> None:
        ...  # todo: run checks, ensure it's a valid value
        self._supply = value
        DB.set_medication_supply(self.name, self._supply)

    @property
    def first_added(self) -> float:
        return self._first_added

    @property
    def last_taken(self) -> float:
        return self._last_taken

    def taken(self) -> bool:
        pass

    def log(self) -> None:
        '''
        Returns the time, name of the medication, the dosage, and any comments
        '''
        pass

    def get_all_medications() -> list['Medication']:
        """Parses a dictionary of medication objects, often used with Database.get_medications.

        Returns:
            list[Medication]: A list of Medication
        """
        return [Medication(**med) for med in DB.get_medications()]

    def change_dosage(self, new_dosage: float) -> None:
        self.dosage = new_dosage


if __name__ == "__main__":
    med = Medication("Zoloft", "Brand", 25.0, 5.0)

    print(med.name)
