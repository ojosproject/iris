// All contacts associated with the user.
export type Contact = {
    id: string;
    name: string;
    phone_number?: string;
    company?: string,
    email?: string;
    last_updated: number;
  };