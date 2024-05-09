# Database.py
# Ojos Project
#
# This file will contain database-related content.
import json
import sqlite3
from pathlib import Path


class Database:
    def __init__(self, path_to_db: str) -> None:
        self._connection = sqlite3.connect(path_to_db)

    def get_medications(self, include_only: list[str] = []) -> list[dict]:
        # todo: need to include the `include_only` feature
        """Return all medications in the database unless `include_only` is specified.

        Args:
            include_only (list[str], optional): A list of strings with the name of the medication. Defaults to [].

        Returns:
            list: Returns a list of dictionaries that represent
        """
        list_to_return = []

        with self._connection as db:
            cursor = db.execute("SELECT * FROM medication")

            for medication in cursor.fetchall():
                list_to_return.append({"name": medication[0], "brand": medication[1], "dose": float(medication[2]), "supply": float(
                    medication[3]), "first_added": float(medication[4]), "last_token": float(medication[5])})

        return list_to_return

    def set_medication_dosage(self, name: str, dosage: float) -> None:
        with self._connection as db:
            # todo: run tests
            db.execute(
                'UPDATE medication SET dosage = :dosage WHERE name = :name', {
                    'dosage': dosage, 'name': name}
            )

            db.commit()

    def set_medication_supply(self, name: str, supply: float) -> None:
        with self._connection as db:
            # todo: run tests
            db.execute(
                'UPDATE medication SET supply = :supply WHERE name = :name', {
                    'supply': supply, 'name': name}
            )

            db.commit()

    def add_medication(self) -> None:
        ...
