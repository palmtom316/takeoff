use std::collections::BTreeMap;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuantityLine {
    pub line_tag: String,
    pub component_id: String,
    pub description: String,
    pub unit: String,
    pub quantity: f64,
    pub item_code: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuantityTotals {
    pub by_unit: BTreeMap<String, f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuantityResult {
    pub lines: Vec<QuantityLine>,
    pub totals: QuantityTotals,
}
