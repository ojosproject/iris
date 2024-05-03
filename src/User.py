# User.py
# Ojos Project
# 
# Contains user-related material
from main import DB
from Medications import Medication

class User():
    def __init__(self, pin: int):
        self._type = self.verify_pin(pin)

        if self._type == None:
            raise Exception("The pin is not valid.")

    def verify_pin(self, pin : int) -> str:
        '''
        Verifies that the inputted pin is valid

        Return the type, or None.
        if it's None, it's not a valid pin
        '''
        pass

    @property
    def type(self) -> str:
        return self._type

    def get_patient_medications() -> list[Medication]:
        '''
        Returns the patient's list of Medications
        '''
        return Medication.get_all_medications()
    
    def get_care_instructions(self) -> list[str]:
        '''
        Returns a list of care instructions pertaining to the Patient
        '''
        pass

class Patient(User):
    def __init__(self, type_of_user):
        super().__init__(type_of_user)