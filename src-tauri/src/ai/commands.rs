// ai/commands.rs
// Ojos Project
use crate::core::{config::get_config, structs::Config};
use anyhow::Result;
use mistralrs::{GgufModelBuilder, TextMessageRole, TextMessages};
use tauri::{AppHandle, Manager};
use tokio::time::{timeout, Duration};


#[tauri::command]
pub fn load_model(app: AppHandle) {
    /* This function will be enabled when the toggle AI switch in the settings page is toggled.
    It will then check if the model is installed in the expected location (recommended location will be specified in Iris docs.) TODO: add link to docs. If not found at
    recommended location, it will show a pop-up asking the user to input a path to search for the model. Once the model is found, it will load the model
    and enable all ai features.
     */

    println!("load_model was called.");

    let config: Config = get_config(app.app_handle());
    println!("AI Feature Enabled? {}", config.enable_ai);
    if config.enable_ai {
        // Spawn the async task
        tauri::async_runtime::spawn(async {
            match call_model().await {
                Ok(_) => println!("Model loaded successfully."),
                Err(e) => eprintln!("Failed to load model: {:?}", e),
            }
        });
    }
}

pub async fn call_model() -> Result<()> {
    // We do not use any files from remote servers here, and instead load the
    // chat template from the specified file, and the tokenizer and model from a
    // local GGUF file at the path specified.

    println!("Starting the model loading process...");
    let model = GgufModelBuilder::new(
        r"C:\Users\ayush\.cache\lm-studio\models\hugging-quants\Llama-3.2-1B-Instruct-Q8_0-GGUF", //TODO ADD MODEL PATH FROM IRIS HERE
        vec!["llama-3.2-1b-instruct-q8_0.gguf"], //TODO ADD FILE HERE
    )
    //.with_chat_template(r"chat_templates\default.json")
    .with_logging()
    //.with_paged_attn(|| PagedAttentionMetaBuilder::default().build())?
    .build()
    .await?;
    println!("Model loaded successfully.");

    println!("Preparing chat messages...");
    // Send a chat request
    let messages = TextMessages::new().add_message(TextMessageRole::User, "Hello!");
    println!("Messages prepared: {:?}", messages);

    println!("Sending request to the model...");
    // let response = model.send_chat_request(messages).await?;
    // println!("{}", response.choices[0].message.content.as_ref().unwrap());

    let result = timeout(Duration::from_secs(30), model.send_chat_request(messages)).await;

    match result {
        Ok(Ok(response)) => {
            println!(
                "Response received successfully: {}",
                response.choices[0]
                    .message
                    .content
                    .as_ref()
                    .unwrap_or(&"Empty response".to_string())
            );
        }
        Ok(Err(err)) => {
            println!("Error while receiving response: {:?}", err);
        }
        Err(_) => {
            println!("Request timed out.");
        }
    }

    // println!("Sending request to the model...");
    // match model.send_chat_request(messages).await {
    //     Ok(response) => {
    //         println!(
    //             "Response received successfully: {}",
    //             response.choices[0]
    //                 .message
    //                 .content
    //                 .as_ref()
    //                 .unwrap_or(&"Empty response".to_string())
    //         );
    //     }
    //     Err(err) => {
    //         println!("Error while receiving response: {:?}", err);
    //     }
    // }

    // dbg!(
    //     response.usage.avg_prompt_tok_per_sec,
    //     response.usage.avg_compl_tok_per_sec
    // );

    println!("Execution completed.");
    Ok(())
}
