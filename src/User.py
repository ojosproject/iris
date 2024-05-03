# User.py
# Ojos Project
# 
# Contains user-related material

import Medication

class User():
    def __init__(self, type_of_user):
        self.type = type_of_user

    def verify_pin(pin : int) -> bool:
        '''
        Verifies that the inputted pin is valid
        '''
        pass
    
    def set_user_type(new_user_type : str) -> None:
        self.type = new_user_type

    def get_patient_medications() -> Medication[]:
        '''
        Returns the patient's list of Medications
        '''
        return Medication.get_medications()
    
    def get_care_instructions() -> str[]:
        '''
        Returns a list of care instructions pertaining to the Patient
        '''
        pass