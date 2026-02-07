export interface DepthBand {
  min_depth_m: number;
  max_depth_m: number;
  soil_ratio: number;
  rock_ratio: number;
}

export interface TrenchSegment {
  id: string;
  name: string;
  length_m: number;
  width_m: number;
  depth_m: number;
  source_refs: string[];
}

export interface Manhole {
  id: string;
  name: string;
  pit_length_m: number;
  pit_width_m: number;
  pit_depth_m: number;
  wall_thickness_m: number;
  source_refs: string[];
}

export interface DraftModel {
  version: string;
  trenches: TrenchSegment[];
  manholes: Manhole[];
}

export interface QuantityLine {
  line_tag: string;
  component_id: string;
  description: string;
  unit: string;
  quantity: number;
  item_code?: string | null;
}

export interface QuantityTotals {
  by_unit: Record<string, number>;
}

export interface QuantityResult {
  lines: QuantityLine[];
  totals: QuantityTotals;
}

export interface ParseDxfMockRequest {
  file_name?: string | null;
}

export interface ParseDxfMockResponse {
  draft_model: DraftModel;
  warnings: string[];
}

export interface QuantityCalcRequest {
  draft_model: DraftModel;
  depth_bands: DepthBand[];
}

export interface QuantityCalcResponse {
  result: QuantityResult;
}
