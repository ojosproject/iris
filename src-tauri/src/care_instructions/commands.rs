// File:     care_instructions/commands.rs
// Purpose:  Extra care instructions provided by the caregivers for the nurses.
// Authors:  Ojos Project & Iris contributors
// License:  GNU General Public License v3.0
use crate::care_instructions::structs::CareInstruction;
use crate::helpers::{db_connect, stamp, unix_timestamp};
use rusqlite::named_params;
use tauri::AppHandle;

/// # `get_all_care_instructions` Command
///
/// Returns a `CareInstruction[]`.
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke<CareInstruction[]>('get_all_care_instructions').then(ci => {
///     setCareInstructions(ci);
/// });
/// ```
#[tauri::command]
pub fn get_all_care_instructions(app: AppHandle) -> Vec<CareInstruction> {
    let conn = db_connect(&app);

    let mut stmt = conn
        .prepare("SELECT * FROM care_instruction ORDER BY last_updated DESC")
        .unwrap();
    let matched_ci = stmt
        .query_map([], |row| {
            Ok(CareInstruction {
                id: row.get(0)?,
                title: row.get(1)?,
                content: row.get(2)?,
                frequency: row.get(3)?,
                added_by: row.get(4)?,
                last_updated: row.get(5)?,
            })
        })
        .unwrap();

    let mut vec_to_return: Vec<CareInstruction> = vec![];
    for ci in matched_ci {
        vec_to_return.push(ci.unwrap());
    }

    vec_to_return
}

/// # `get_single_care_instruction` command
///
/// Returns a single care instructions, with the provided `id`.
///
/// ## TypeScript
///
/// ```typescript
/// invoke<CareInstruction>('get_single_care_instruction', {id: ''}).then(ci => {
///     if (ci) { // this COULD return a null, check!
///         setCareInstruction(ci);
///     }
///     
/// });
/// ```
#[tauri::command(rename_all = "snake_case")]
pub fn get_single_care_instruction(app: AppHandle, id: String) -> Option<CareInstruction> {
    for instruction in get_all_care_instructions(app) {
        if instruction.id == id {
            return Some(instruction);
        }
    }
    return None;
}

/// # `create_care_instructions` Command
///
/// Creates a new `CareInstruction` and returns it
///
/// ## TypeScript Usage
///
/// ```typescript
/// invoke<CareInstruction>('create_care_instructions', {
///         title: 'Move Patient',
///         content: 'Please help her move once in a while.',
///         frequency: 'Once daily',
///         added_by: 'nurse_id'
///     }).then(ci => {
///     setCareInstructions(ci);
/// })
/// ```
#[tauri::command(rename_all = "snake_case")]
pub fn create_care_instructions(
    app: AppHandle,
    title: String,
    content: String,
    frequency: Option<String>,
    added_by: String,
) -> CareInstruction {
    let conn = db_connect(&app);
    let (timestamp, uuid) = stamp();

    let ci = CareInstruction {
        id: uuid,
        title,
        content,
        frequency,
        added_by,
        last_updated: timestamp,
    };

    conn.execute("INSERT INTO care_instruction(id, title, content, frequency, added_by, last_updated) VALUES (?1, ?2, ?3, ?4, ?5, ?6)", (&ci.id, &ci.title, &ci.content, &ci.frequency, &ci.added_by, &ci.last_updated)).unwrap();
    ci
}

/// # `update_care_instructions` Command
///
/// Updates a single `CareInstruction` and returns it.
///
/// ## TypeScript
///
/// ```typescript
/// invoke<CareInstruction>('update_care_instructions', {
///         id: 'uuid',
///         title: 'Move Patient (Edited)',
///         content: 'Please help her move once in a while.',
///         frequency: 'Once daily',
///         added_by: 'nurse_id'
///     }).then(ci => {
///     setCareInstructions(ci);
/// })
/// ```
#[tauri::command(rename_all = "snake_case")]
pub fn update_care_instructions(
    app: AppHandle,
    id: String,
    title: String,
    content: String,
    frequency: Option<String>,
    added_by: String,
) -> CareInstruction {
    let conn = db_connect(&app);
    let ts = unix_timestamp();

    let ci = CareInstruction {
        id,
        title,
        content,
        frequency,
        added_by,
        last_updated: ts,
    };

    conn.execute(
        "UPDATE care_instruction SET title=:title, content=:content, frequency=:frequency, added_by=:added_by, last_updated=:last_updated WHERE id=:id",
        named_params! {
            ":id": &ci.id,
            ":title": &ci.title,
            ":content": &ci.content,
            ":frequency": &ci.frequency,
            ":added_by": &ci.added_by,
            ":last_updated": &ci.last_updated
        },
    )
    .unwrap();

    ci
}

/// # `care_instructions_previous_next_ids` Command
///
/// Returns an array with the `CareInstruction.id` of the previous and next
/// care instruction for the "Previous Topic" and "Next Topic" buttons. Index
/// 0 is the previous ID, index 1 is the next ID.
///
/// ## TypeScript
///
/// ```typescript
/// invoke('care_instructions_previous_next_ids', {id: 'uuid'}).then(previousNext => {
///     setPreviousTopic(previousNext[0]);
///     setNextTopic(previousNext[1]);)
/// })
/// ```
#[tauri::command(rename=all = "snake_case")]
pub fn care_instructions_previous_next_ids(app: AppHandle, id: String) -> Vec<String> {
    let instructions = get_all_care_instructions(app);
    let mut previous = 0;
    let mut next = 0;
    for (index, instruction) in instructions.iter().enumerate() {
        if instruction.id == id {
            if instructions.len() == 1 {
                [previous, next] = [0, 0]
            } else if index == 0 {
                previous = instructions.len() - 1;
                next = index + 1;
            } else if index == instructions.len() - 1 {
                previous = index - 1;
                next = 0;
            } else {
                previous = index - 1;
                next = index + 1;
            }
        }
    }

    return vec![
        (&instructions[previous]).id.clone(),
        (&instructions[next]).id.clone(),
    ];
}

#[tauri::command(rename_all = "snake_case")]
pub fn delete_care_instructions(app: AppHandle, id: String) {
    let conn = db_connect(&app);

    conn.execute(
        "DELETE FROM care_instruction WHERE id=:id",
        named_params! {":id": id},
    )
    .unwrap();
}
