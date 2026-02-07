use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DepthBand {
    pub min_depth_m: f64,
    pub max_depth_m: f64,
    pub soil_ratio: f64,
    pub rock_ratio: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TrenchSegment {
    pub id: String,
    pub name: String,
    pub length_m: f64,
    pub width_m: f64,
    pub depth_m: f64,
    pub source_refs: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Manhole {
    pub id: String,
    pub name: String,
    pub pit_length_m: f64,
    pub pit_width_m: f64,
    pub pit_depth_m: f64,
    pub wall_thickness_m: f64,
    pub source_refs: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DraftModel {
    pub version: String,
    pub trenches: Vec<TrenchSegment>,
    pub manholes: Vec<Manhole>,
}
