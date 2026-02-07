use std::collections::BTreeMap;

use serde::{Deserialize, Serialize};
use thiserror::Error;

use crate::{
    model::{DepthBand, DraftModel, Manhole, TrenchSegment},
    quantity::{QuantityLine, QuantityResult, QuantityTotals},
};

#[derive(Debug, Error)]
pub enum CoreEngineError {
    #[error("draft model is empty")]
    EmptyDraftModel,
}

pub type CoreEngineResult<T> = Result<T, CoreEngineError>;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ParseDxfMockRequest {
    pub file_name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ParseDxfMockResponse {
    pub draft_model: DraftModel,
    pub warnings: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuantityCalcRequest {
    pub draft_model: DraftModel,
    pub depth_bands: Vec<DepthBand>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuantityCalcResponse {
    pub result: QuantityResult,
}

pub fn parse_dxf_mock(payload: ParseDxfMockRequest) -> CoreEngineResult<ParseDxfMockResponse> {
    let warnings = if payload.file_name.is_some() {
        vec![]
    } else {
        vec!["missing file name, falling back to built-in sample".to_string()]
    };

    Ok(ParseDxfMockResponse {
        draft_model: DraftModel {
            version: "v1".to_string(),
            trenches: vec![TrenchSegment {
                id: "trench-001".to_string(),
                name: "主干沟段 A".to_string(),
                length_m: 28.0,
                width_m: 1.2,
                depth_m: 2.1,
                source_refs: vec![
                    "LAYER:PIPE-TRENCH".to_string(),
                    "POLYLINE:73".to_string(),
                    "TEXT:DN500".to_string(),
                ],
            }],
            manholes: vec![Manhole {
                id: "manhole-001".to_string(),
                name: "检查井 M1".to_string(),
                pit_length_m: 2.2,
                pit_width_m: 2.2,
                pit_depth_m: 3.0,
                wall_thickness_m: 0.24,
                source_refs: vec!["BLOCK:MANHOLE".to_string(), "TEXT:WELL-M1".to_string()],
            }],
        },
        warnings,
    })
}

pub fn calculate_quantities_mock(
    payload: QuantityCalcRequest,
) -> CoreEngineResult<QuantityCalcResponse> {
    if payload.draft_model.trenches.is_empty() && payload.draft_model.manholes.is_empty() {
        return Err(CoreEngineError::EmptyDraftModel);
    }

    let mut lines = Vec::new();

    for trench in &payload.draft_model.trenches {
        let excavation = trench.length_m * trench.width_m * trench.depth_m;
        let backfill = excavation * 0.62;

        lines.push(QuantityLine {
            line_tag: "trench.excavation".to_string(),
            component_id: trench.id.clone(),
            description: format!("{} 沟槽开挖", trench.name),
            unit: "m3".to_string(),
            quantity: round3(excavation),
            item_code: None,
        });

        lines.push(QuantityLine {
            line_tag: "trench.backfill".to_string(),
            component_id: trench.id.clone(),
            description: format!("{} 沟槽回填", trench.name),
            unit: "m3".to_string(),
            quantity: round3(backfill),
            item_code: None,
        });
    }

    for manhole in &payload.draft_model.manholes {
        let pit_excavation = manhole.pit_length_m * manhole.pit_width_m * manhole.pit_depth_m;
        let slab_concrete = manhole.pit_length_m * manhole.pit_width_m * 0.25;

        lines.push(QuantityLine {
            line_tag: "manhole.pit_excavation".to_string(),
            component_id: manhole.id.clone(),
            description: format!("{} 井坑开挖", manhole.name),
            unit: "m3".to_string(),
            quantity: round3(pit_excavation),
            item_code: None,
        });

        lines.push(QuantityLine {
            line_tag: "manhole.slab_concrete".to_string(),
            component_id: manhole.id.clone(),
            description: format!("{} 底板混凝土", manhole.name),
            unit: "m3".to_string(),
            quantity: round3(slab_concrete),
            item_code: None,
        });
    }

    let mut by_unit = BTreeMap::new();
    for line in &lines {
        let entry = by_unit.entry(line.unit.clone()).or_insert(0.0);
        *entry = round3(*entry + line.quantity);
    }

    Ok(QuantityCalcResponse {
        result: QuantityResult {
            lines,
            totals: QuantityTotals { by_unit },
        },
    })
}

fn round3(value: f64) -> f64 {
    (value * 1000.0).round() / 1000.0
}
