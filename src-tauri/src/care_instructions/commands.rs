use crate::care_instructions::helper;
use crate::care_instructions::structs::CareInstruction;
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
    helper::get_all_care_instructions(&app)
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
    for instruction in helper::get_all_care_instructions(&app) {
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
    helper::add_care_instruction(&app, title, content, frequency, added_by)
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
    helper::update_care_instructions(&app, id, title, content, frequency, added_by)
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
    let instructions = helper::get_all_care_instructions(&app);
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
    helper::delete_care_instructions(&app, id);
}
