use core_engine::api::{
    calculate_quantities_mock as core_calculate_quantities_mock,
    parse_dxf_mock as core_parse_dxf_mock,
    ParseDxfMockRequest,
    ParseDxfMockResponse,
    QuantityCalcRequest,
    QuantityCalcResponse,
};

#[tauri::command]
pub fn parse_dxf_mock(payload: ParseDxfMockRequest) -> Result<ParseDxfMockResponse, String> {
    core_parse_dxf_mock(payload).map_err(|err| err.to_string())
}

#[tauri::command]
pub fn calculate_quantities_mock(
    payload: QuantityCalcRequest,
) -> Result<QuantityCalcResponse, String> {
    core_calculate_quantities_mock(payload).map_err(|err| err.to_string())
}
