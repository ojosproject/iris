# Medications.py
# Ojos Project
# 
# This file will include medication-related material.

from main import DB

def get_medications():
    pass

class Medication:
    def __init__(self, name : str, brand : str, dosage : float):
        self.name = name
        self.brand = brand
        self.dosage = dosage
    
    def taken() -> bool:
        pass

    def log() -> None:
        pass

    def change_dosage(new_dosage : float) -> None:
        self.dosage = new_dosage
