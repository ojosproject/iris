/*
resource
Resources available for the patient and their family

Rows:
    label    - The display name of the resource
    * value  - Usually a URL, given to make `label` a link
    added_by - Full name of the individual who added this resource
    type     - The type of the resource. `FINANCIAL`, `MENTAL HEALTH`, & more
*/
CREATE TABLE IF NOT EXISTS resource (
    label TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL PRIMARY KEY,
    organization TEXT NOT NULL,
    category TEXT NOT NULL,
    last_updated REAL NOT NULL
) STRICT;
