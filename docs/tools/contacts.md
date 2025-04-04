# Contacts Tool

The Contacts tool is meant to be similar to other mobile contacts apps. It's a
list of people's names, phone numbers, emails, etc. This tool requires a
**frontend** and a **backend**. The purpose of this tool is to use the numbers
as references in case of an emergency, or simply needing to get ahold of the
nursing staff. This tool will also further enhance Iris by providing labels to
phone numbers and being a quicker and easier way to add phone numbers to the
Relay functionality.

The Contacts tool is going to be implemented by
[Ayush Jain](https://github.com/AyushBot412).

## UI Design

The design is currently being created by
[Jesse David](https://github.com/jessed7).

## Software Design

### SQL Schema

- `id` - a UUID automatically generated by Iris
- `name` - an individual's name
- `phone_number` - An individual's phone number (optional)
- `email` - An individual's email (optional)
- `company` - An individual's employer (optional -- mostly for nursing staff)

### Other requirements

- An "Add to Relay" button (renaming is fine) must be added next to a phone
  number. If clicked, it must redirect to the Settings page
- Functions to...
  - Return all contacts
  - Create a contact
  - Update a contact
  - Delete a contact
