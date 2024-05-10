# test_database.py
# Ojos Project
#
# Tests src/Database.py
# To run tests, use these commands:
# macOS/Linux: pipenv run coverage; pipenv run report;
# Windows: python -m pipenv run coverage; python -m pipenv run report;
import unittest
from src.Database import Database
from sqlite3 import Connection, OperationalError
from pathlib import Path
import os


class TestMedicationDatabase(unittest.TestCase):
    path = Path('database.db')

    def setUp(self):
        """Sets up testing.
        """
        if self.path.exists():
            # If `database.db` somehow exists even with tearDown(), delete it
            os.remove(self.path)

        # Recreating a fresh database
        self.db = Database(self.path)
        self.connection: Connection = self.db._connection

        try:

            with open("src/schema.sql", "r") as f:
                with self.connection as con:
                    con.executescript(f.read())
                    con.commit()
                    con.close()
        except OperationalError as e:
            print(e)

    def tearDown(self):
        # After every test, if `database.db` exists, delete it
        self.connection.close()
        if self.path.exists():
            os.remove(self.path)

    def test_medication_starts_empty(self):
        self.assertEqual(self.db.get_medications(), [])

    def test_add_med_adds_to_db(self):
        self.db.add_medication('name', 'brand', 1, 2, 3, 4)
        self.assertEqual(self.db.get_medications(), [
            {'name': 'name', 'brand': 'brand', 'dose': 1, 'frequency': 'AS NEEDED', 'supply': 2, 'first_added': 3, 'last_taken': 4}])

    def test_medication_dosage_updated(self):
        self.db.add_medication('name', 'brand', 1, 2, 3, 4)
        self.db.set_medication_dose('name', 10)
        self.assertEqual(self.db.get_medications(), [
            {'name': 'name', 'brand': 'brand', 'dose': 10, 'frequency': 'AS NEEDED', 'supply': 2, 'first_added': 3, 'last_taken': 4}])

    def test_medication_supply_updated(self):
        self.db.add_medication('name', 'brand', 1, 2, 3, 4)
        self.db.set_medication_supply('name', 10)
        self.assertEqual(self.db.get_medications(), [
            {'name': 'name', 'brand': 'brand', 'dose': 1, 'frequency': 'AS NEEDED', 'supply': 10, 'first_added': 3, 'last_taken': 4}])

    def test_medication_deleted(self):
        self.db.add_medication('name', 'brand', 1, 2, 3, 4)
        self.assertEqual(self.db.get_medications(), [
            {'name': 'name', 'brand': 'brand', 'dose': 1, 'frequency': 'AS NEEDED', 'supply': 2, 'first_added': 3, 'last_taken': 4}])
        self.db.del_medication('name')
        self.assertEqual(self.db.get_medications(), [])

    def test_med_in_database_check(self):
        self.db.add_medication('name of a medication',
                               'medication branding', 1, 2, 3, 4)

        self.assertTrue(self.db._med_in_db('name of a medication'))

    def test_not_in_database_check(self):
        self.assertFalse(self.db._med_in_db('not included'))
