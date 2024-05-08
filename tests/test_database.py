# test_database.py
# Ojos Project
#
# Tests src/Database.py
# To run tests, use these commands:
# macOS/Linux: pipenv run coverage; pipenv run report;
# Windows: python -m pipenv run coverage; python -m pipenv run report;
import unittest
from src.Database import Database
from sqlite3 import Connection
from pathlib import Path
import os


class TestDatabase(unittest.TestCase):
    path = Path('database.db')

    def setUp(self):
        """Sets up testing.
        """
        if self.path.exists():
            # If `database.db` exists from previous testing, delete it
            os.remove(self.path)

        # Recreating a fresh database
        self.db = Database(self.path)
        self.connection: Connection = self.db._connection

        with open("src/schema.sql", "r") as f:
            with self.connection as con:
                con.executescript(f.read())
                con.commit()

    def test_medication_starts_empty(self):
        self.assertEquals(self.db.get_medications(), [])
