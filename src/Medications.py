# Medications.py
# Ojos Project
#
# This file will include medication-related material.

from main import DB


class Medication:
    def __init__(self, name: str, brand: str, dosage: float, supply: float = None, first_added: float = None, last_taken: float = None, frequency="AS NEEDED"):
        self._name = name
        self._brand = brand
        self._dosage = dosage
        self._frequency = frequency
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

    @property
    def frequency(self) -> str:
        return self._frequency

    @frequency.setter
    def frequency(self, value: str) -> None:
        # todo: at some point, add checks to make sure this is a proper frequency
        self._frequency = value

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
        return self._last_take

    @property
    def last_taken(self) -> int:
        return self._last_taken

    def __eq__(self, value: object) -> bool:
        # __eq__ is used for lists so that we can use:
        # `"med name" in list[Medication]`
        assert type(
            value) is str, f'Medication.__eq__: `value` must be string, not `{type(value)}`'

        return self.name == value

    def log(self, comments: str = None) -> None:
        self._last_taken = DB.log_medication(
            name=self.name,
            dosage=self.dosage,
            comments=comments
        )

    def get_all_medications() -> list['Medication']:
        return [Medication(**med) for med in DB.get_medications()]

    def change_dosage(self, new_dosage: float) -> None:
        self._dosage = new_dosage
