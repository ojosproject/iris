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
        self._medication_cache = () # cache of patient meds for quick-access

    def get_medications(self, include_only: tuple[str] = ()) -> tuple[dict]:
        #TODO: need to include the `include_only` feature
        """Return all medications in the database unless `include_only` is specified.

        Args:
            include_only (tuple[str], optional): A immutable tuples of strings with the name of the medication. Defaults to ().

        Returns:
            tuple: Returns a tuple of dictionaries where each value represents a medication object
        """
        tuple_to_return = []

        with self._connection as db:

            cursor = db.execute("SELECT * FROM medication")

            for medication in cursor.fetchall():
                tuple_to_return.append({"name": medication[0], "brand": medication[1], "dose": medication[2], "supply": int(
                    medication[3]), "first_added": int(medication[4]), "last_taken": int(medication[5])})

            if include_only: # if there are specific medication(s) that the user wants to find
                cursor = db.execute("SELECT * FROM medication WHERE ")


        return tuple_to_return
    
    

    def set_medication_dose(self, name: str, dose: float) -> None:
        with self._connection as db:
            db.execute(
                'UPDATE medication SET dose = :dose WHERE name = :name', {
                    'dose': dose, 'name': name}
            )

            db.commit()

    def set_medication_supply(self, name: str, supply: float) -> None:
        with self._connection as db:
            db.execute(
                'UPDATE medication SET supply = :supply WHERE name = :name', {
                    'supply': supply, 'name': name}
            )

            db.commit()

    def add_medication(self, name: str, brand: str, dose: int, supply: int, first_added: int, last_taken: int) -> None:
        with self._connection as db:
            db.execute(
                '''INSERT INTO medication (name, brand, dose, supply, first_added, last_taken)
                    VALUES (:name, :brand, :dose, :supply, :first_added, :last_taken)''',
                {'name': name, 'brand': brand, 'dose': dose, 'supply': supply,
                    'first_added': first_added, 'last_taken': last_taken}
            )

            db.commit()

    def del_medication(self, name: str) -> None:
        with self._connection as db:
            db.execute(
                'DELETE FROM medication WHERE name = ?',
                (name,)
            )

            db.commit()