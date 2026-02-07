use core_engine::api::{
    calculate_quantities_mock, parse_dxf_mock, ParseDxfMockRequest, QuantityCalcRequest,
};
use core_engine::model::DepthBand;

#[test]
fn quantity_mock_returns_non_empty_lines_and_positive_totals() {
    let parse_response = parse_dxf_mock(ParseDxfMockRequest {
        file_name: Some("mock-input.dxf".to_string()),
    })
    .expect("parse mock should succeed");

    let response = calculate_quantities_mock(QuantityCalcRequest {
        draft_model: parse_response.draft_model,
        depth_bands: vec![DepthBand {
            min_depth_m: 0.0,
            max_depth_m: 2.0,
            soil_ratio: 0.8,
            rock_ratio: 0.2,
        }],
    })
    .expect("quantity mock should succeed");

    assert!(!response.result.lines.is_empty(), "expected at least one quantity line");

    let total: f64 = response.result.totals.by_unit.values().sum();
    assert!(total > 0.0, "expected positive totals");
}
