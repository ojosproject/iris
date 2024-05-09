# Database.py
# Ojos Project
#
# This file will contain database-related content.
import time
import sqlite3


class MedicationNotFoundError(Exception):
    ...


class MedicationDuplicateError(Exception):
    ...


class Database:
    # todo: Create a convention for us to know which functions are for the
    # todo: Medication table and what is from the Logs table
    def __init__(self, path_to_db: str) -> None:
        self._connection = sqlite3.connect(path_to_db)
        self._medication_cache = ()  # cache of patient meds for quick-access
        self._last_cached = time.time()

    def _med_in_db(self, name: str) -> bool:
        with self._connection as con:
            cur = con.execute(
                "SELECT name FROM medication WHERE name=:name", {'name': name})

            items = cur.fetchone()
            if items:
                return name in items

            return False

    def _update_cache(self) -> None:
        self.get_medications(force_update_cache=True)

    def get_medications(self, include_only: tuple[str] = (), *, force_update_cache=False) -> tuple[dict]:
        # TODO: need to include the `include_only` feature
        if self._medication_cache and not force_update_cache:
            # Cache is updated after 20 minutes, or until _update_cache() is called
            # 1200 seconds is 20 minutes
            if time.time() - self._last_cached > 1200:
                return self._medication_cache

        tuple_to_return = []

        with self._connection as db:

            cursor = db.execute("SELECT * FROM medication")

            for medication in cursor.fetchall():
                tuple_to_return.append({"name": medication[0], "brand": medication[1], "dose": medication[2], "supply": int(
                    medication[3]), "first_added": int(medication[4]), "last_taken": int(medication[5])})

            # if there are specific medication(s) that the user wants to find
            if include_only:
                cursor = db.execute("SELECT * FROM medication WHERE ")

        self._medication_cache = cursor.fetchall()
        self._last_cached = time.time()

        return tuple_to_return

    def set_medication_dose(self, name: str, dose: float) -> None:
        if not self._med_in_db(name):
            raise MedicationNotFoundError(
                f"Database.set_medication_dose: '{name}' was not found in the database.")

        with self._connection as db:
            db.execute(
                'UPDATE medication SET dose = :dose WHERE name = :name', {
                    'dose': dose, 'name': name}
            )

            db.commit()

        self._update_cache()

    def set_medication_supply(self, name: str, supply: float) -> None:
        if not self._med_in_db(name):
            raise MedicationNotFoundError(
                f"Database.set_medication_dose: '{name}' was not found in the database.")

        with self._connection as db:
            db.execute(
                'UPDATE medication SET supply = :supply WHERE name = :name', {
                    'supply': supply, 'name': name}
            )

            db.commit()

        self._update_cache()

    def add_medication(self, name: str, brand: str, dose: int, supply: int, first_added: int, last_taken: int) -> None:
        with self._connection as db:
            db.execute(
                '''INSERT INTO medication (name, brand, dose, supply, first_added, last_taken)
                    VALUES (:name, :brand, :dose, :supply, :first_added, :last_taken)''',
                {'name': name, 'brand': brand, 'dose': dose, 'supply': supply,
                    'first_added': first_added, 'last_taken': last_taken}
            )

            db.commit()

        self._update_cache()

    def del_medication(self, name: str) -> None:
        with self._connection as db:
            db.execute(
                'DELETE FROM medication WHERE name = ?',
                (name,)
            )

            db.commit()
        self._update_cache()

    def log_medication(self, name: str, dosage: str, comments=None) -> None:
        with self._connection as con:
            con.execute(
                "INSERT INTO medication_log (log_timestamp, medication_name, medication_dose, comments) VALUES (:timestamp, :name, :dose, :comments)", {
                    'timestamp': time.time(),
                    'name': name,
                    'dose': dosage,
                    'comments': comments
                }
            )

            con.commit()
