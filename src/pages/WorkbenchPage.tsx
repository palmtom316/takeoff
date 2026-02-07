import { useMemo, useState } from "react";
import { Alert, Button, Card, Col, Row, message } from "antd";
import type { DepthBand, DraftModel, QuantityResult } from "../domain/types";
import { calculateQuantitiesMock, parseDxfMock } from "../services/tauriClient";
import { DxfImportPanel } from "../components/DxfImportPanel";
import { DraftPreview } from "../components/DraftPreview";
import { QuantityResultView } from "../components/QuantityResultView";

const defaultBands: DepthBand[] = [
  { min_depth_m: 0, max_depth_m: 2, soil_ratio: 0.85, rock_ratio: 0.15 },
  { min_depth_m: 2, max_depth_m: 4, soil_ratio: 0.7, rock_ratio: 0.3 }
];

export function WorkbenchPage() {
  const [draft, setDraft] = useState<DraftModel | null>(null);
  const [result, setResult] = useState<QuantityResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);

  const canCalculate = useMemo(() => !!draft && !calculating, [draft, calculating]);

  const handleImport = async (fileName: string | null) => {
    setImporting(true);
    try {
      const response = await parseDxfMock({ file_name: fileName });
      setDraft(response.draft_model);
      setWarnings(response.warnings);
      setResult(null);
      message.success("DXF 占位解析完成");
    } catch (error) {
      message.error(`导入失败: ${String(error)}`);
    } finally {
      setImporting(false);
    }
  };

  const handleCalculate = async () => {
    if (!draft) {
      return;
    }

    setCalculating(true);
    try {
      const response = await calculateQuantitiesMock({ draft_model: draft, depth_bands: defaultBands });
      setResult(response.result);
      message.success("算量完成");
    } catch (error) {
      message.error(`算量失败: ${String(error)}`);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <DxfImportPanel loading={importing} onImport={handleImport} />
          </Card>

          <Card style={{ marginTop: 16 }}>
            <Button type="primary" disabled={!canCalculate} loading={calculating} onClick={() => void handleCalculate()}>
              执行算量
            </Button>
          </Card>

          {warnings.length > 0 && (
            <Alert
              style={{ marginTop: 16 }}
              type="warning"
              message="解析警告"
              description={warnings.join("; ")}
            />
          )}
        </Col>

        <Col xs={24} md={16}>
          <Card>
            <DraftPreview draft={draft} />
          </Card>

          <Card style={{ marginTop: 16 }}>
            <QuantityResultView result={result} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
