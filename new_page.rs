// new_page.rs
// Ojos Project
// 
// Creates a new page for the frontend developers.

use std::{env, fs, io::stdin, path::PathBuf};

fn input(message: &str) -> String {
    let mut input = String::new();

    println!("{}", message);
    stdin().read_line(&mut input).expect("Failed to read input.");

    String::from(input.trim())
}

fn create_files(cwd: PathBuf, name: &String) {
    // components/
    fs::create_dir_all(cwd.join(format!("src/app/{}/components/", name))).expect("Creating the components directory failed.");
    // .tsx
    fs::write(cwd.join(format!("src/app/{}/page.tsx", name)), "// page.tsx\n// Ojos Project\n//\n// Enter a description of this page here!\n").expect("Failed to write .tsx file.");
    // .module.css
    fs::write(cwd.join(format!("src/app/{}/page.module.css", name)), "/*\npage.module.css\nOjos Project\n\nEnter a description of this page here!\n*/\n").expect("Failed to write .module.css file.");
}

fn main() {
    let cwd = env::current_dir().expect("Current directory could not be found.");

    if !cwd.read_dir().unwrap().any(|x| x.unwrap().file_name() == ".mailmap") {
        panic!("ERROR: This does not seem to be a git repository. Is this the Iris repo?")
    }
    let page_name = input("Name your page:");

    println!("\nWARNING: Will create these files.");
    let extensions = [".tsx", ".module.css"];
    for extension in extensions {
        println!("- src/app/{page_name}/page{extension}");
    }
    println!("- src/app/{page_name}/components/");

    let yes_no = input("\n\nDoes this look right? (y/N)");

    if yes_no.eq_ignore_ascii_case("y") {
        create_files(cwd, &page_name);
        println!("Created!")
    } else {
        println!("Abandoning...")
    }
}
