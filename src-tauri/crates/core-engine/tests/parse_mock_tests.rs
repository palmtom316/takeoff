use core_engine::api::{parse_dxf_mock, ParseDxfMockRequest};

#[test]
fn parse_mock_returns_trench_and_manhole() {
    let response = parse_dxf_mock(ParseDxfMockRequest {
        file_name: Some("mock-input.dxf".to_string()),
    })
    .expect("parse mock should succeed");

    assert!(
        !response.draft_model.trenches.is_empty(),
        "expected at least one trench"
    );
    assert!(
        !response.draft_model.manholes.is_empty(),
        "expected at least one manhole"
    );
}
