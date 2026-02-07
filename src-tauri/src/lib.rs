mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::parse_dxf_mock,
            commands::calculate_quantities_mock
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
