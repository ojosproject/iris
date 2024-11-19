// Extra care instructions provided by the caregivers for the nurses.
export type CareInstruction = {
  id: string;
  title: string;
  content: string;
  frequency: string;
  added_by: string;
  last_updated: number;
};
