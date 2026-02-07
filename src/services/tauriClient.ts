import { invoke } from "@tauri-apps/api/core";
import type {
  DraftModel,
  ParseDxfMockRequest,
  ParseDxfMockResponse,
  QuantityCalcRequest,
  QuantityCalcResponse
} from "../domain/types";

const defaultDraftModel: DraftModel = {
  version: "v1",
  trenches: [
    {
      id: "trench-001",
      name: "主干沟段 A",
      length_m: 28,
      width_m: 1.2,
      depth_m: 2.1,
      source_refs: ["LAYER:PIPE-TRENCH", "TEXT:DN500"]
    }
  ],
  manholes: [
    {
      id: "manhole-001",
      name: "检查井 M1",
      pit_length_m: 2.2,
      pit_width_m: 2.2,
      pit_depth_m: 3.0,
      wall_thickness_m: 0.24,
      source_refs: ["BLOCK:MANHOLE", "TEXT:WELL-M1"]
    }
  ]
};

const isTauriRuntime = () => {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
};

const calculateMock = (draftModel: DraftModel): QuantityCalcResponse => {
  const lines: QuantityCalcResponse["result"]["lines"] = [];

  for (const trench of draftModel.trenches) {
    const excavation = trench.length_m * trench.width_m * trench.depth_m;
    const backfill = excavation * 0.62;
    lines.push(
      {
        line_tag: "trench.excavation",
        component_id: trench.id,
        description: `${trench.name} 沟槽开挖`,
        unit: "m3",
        quantity: Number(excavation.toFixed(3)),
        item_code: null
      },
      {
        line_tag: "trench.backfill",
        component_id: trench.id,
        description: `${trench.name} 沟槽回填`,
        unit: "m3",
        quantity: Number(backfill.toFixed(3)),
        item_code: null
      }
    );
  }

  for (const manhole of draftModel.manholes) {
    const pitExcavation = manhole.pit_length_m * manhole.pit_width_m * manhole.pit_depth_m;
    const slabConcrete = manhole.pit_length_m * manhole.pit_width_m * 0.25;
    lines.push(
      {
        line_tag: "manhole.pit_excavation",
        component_id: manhole.id,
        description: `${manhole.name} 井坑开挖`,
        unit: "m3",
        quantity: Number(pitExcavation.toFixed(3)),
        item_code: null
      },
      {
        line_tag: "manhole.slab_concrete",
        component_id: manhole.id,
        description: `${manhole.name} 底板混凝土`,
        unit: "m3",
        quantity: Number(slabConcrete.toFixed(3)),
        item_code: null
      }
    );
  }

  const byUnit: Record<string, number> = {};
  for (const line of lines) {
    byUnit[line.unit] = Number(((byUnit[line.unit] ?? 0) + line.quantity).toFixed(3));
  }

  return {
    result: {
      lines,
      totals: { by_unit: byUnit }
    }
  };
};

export async function parseDxfMock(payload: ParseDxfMockRequest): Promise<ParseDxfMockResponse> {
  if (isTauriRuntime()) {
    return invoke<ParseDxfMockResponse>("parse_dxf_mock", { payload });
  }

  return {
    draft_model: defaultDraftModel,
    warnings: payload.file_name ? [] : ["未提供文件名，返回默认示例草稿模型"]
  };
}

export async function calculateQuantitiesMock(
  payload: QuantityCalcRequest
): Promise<QuantityCalcResponse> {
  if (isTauriRuntime()) {
    return invoke<QuantityCalcResponse>("calculate_quantities_mock", { payload });
  }

  return calculateMock(payload.draft_model);
}
