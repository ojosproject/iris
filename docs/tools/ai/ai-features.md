# AI Features

If you toggle the AI feature in Iris's settings page, it enables a localized Large Learning Model (LLM) called [Llama-3.2-1B-Instruct-Q8_0-GGUF](https://huggingface.co/hugging-quants/Llama-3.2-1B-Instruct-Q8_0-GGUF).

This model is locally hosted, so it can work without internet access, and is used to implement various features to aid the user in caregiving tasks.

> [!CAUTION]
> The features below are still in active development. Do not use these features until a stable version has been released.

| Feature                                   | Priority | Type of NLP Task   |
| ----------------------------------------- | -------- | ------------------ |
| Care Instruction - Description Generation | High     | Text Generation    |
| Patient Data Summarization                | High     | Text Summarization |
| Resource Summarization                    | Low      | Text Summarization |

## Important Files/Folders

As the AI feature is primarily intended to be ran in the background, there will be little-to-no front-end files.

- Backend
  - `src-tauri/src/ai`: Folder containing AI functionality
  - `src-tauri/src/ai/commands.rs` File containing main functionality
  - `src-tauri/src/ai/helpers.rs` Helper functions for AI feature
  - `src-tauri/src/ai/mod.rs` Visibility file to allow `main.rs` to see the AI folder
  - `src-tauri/src/ai/schema.sql` Data and Datatypes for AI feature
  - `src-tauri/src/ai/structs.rs` Structure for local database

## Care Instructions - Description Generation

NLP Task: `Text Generation`.

In the **Care Instructions** feature, when a user begins creating new care instructions and finishes entering a title, the system captures the value once the user clicks away from the field. It then generates detailed care instructions based on the provided title in the following format:

- `"Content"` (string): The detailed care instructions based on the message.
- `"Frequency"` (string): If relevant to the care instructions generated for `content`, it generates a second string describing how often the care instructions should be followed.

How to Use:

1. Ensure the AI switch is toggled in the **Settings** page.
2. Go to the **Care Instruction** page and create a new care instruction.
3. Fully enter your title.
4. Click away from the field and the AI will generate a description in the format above.

## Global - Patient Data Summarization

NLP Task: `Text Summarization`.

The model gets three sections of patient data in JSON format from the Iris Database: `PROs`, `Medications`, and `Care Instructions`; it then generates summaries and data accordingly.

- `PROs`: Generates summaries of the past PROs submitted by the patient.
- `Medications`: Generates summary of all medications taken in the past day, with timestamps and dosage.
- `Care Instructions`: Generates one-line summary of care instruction, ordered by priority. **Note:** *Only generates summary if the CI has been edited in the past day.*

How to Use: `TODO`

## Resources - Resource Summarization

NLP Task: `Text Summarization`.

> [!IMPORTANT]
> Information in the resources may be outdated. Always consult a medical professional before taking any action.

The model gets all resources from the **Resources** page and analyzes each resource's information to and creates summaries for each one.

How to Use: `TODO`
