# test_medications.py
# Ojos Project
#
# Tests src/Medications.py
import unittest
import os
from src.Medications import Medication, DB
from pathlib import Path
from sqlite3 import Connection, OperationalError


class TestMedicationsClass(unittest.TestCase):
    path = Path('database.db')

    def setUp(self):
        """Sets up testing.
        """
        if self.path.exists():
            # If `database.db` somehow exists even with tearDown(), delete it
            os.remove(self.path)

        # Recreating a fresh database
        self.db = DB
        connection: Connection = self.db._connection

        try:

            with open("src/schema.sql", "r") as f:
                with connection as con:
                    con.executescript(f.read())
                    con.commit()
        except OperationalError as e:
            print(e)

        self.db.add_medication(
            name="Zoloft",
            brand="Zoloft",
            dose=100,
            supply=50,
            first_added=0,
            last_taken=0
        )

        self.meds = Medication.get_all_medications()

    # def tearDown(self):
    #    os.remove("database.db")

    def test_getting_medications(self):
        ...
