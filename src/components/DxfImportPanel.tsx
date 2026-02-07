import { useState } from "react";
import { Button, Space, Typography } from "antd";

interface Props {
  loading: boolean;
  onImport: (fileName: string | null) => Promise<void>;
}

export function DxfImportPanel({ loading, onImport }: Props) {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Typography.Title level={5}>DXF 导入（占位）</Typography.Title>
      <input
        data-testid="dxf-input"
        type="file"
        accept=".dxf"
        onChange={(event) => {
          const file = event.target.files?.[0];
          setFileName(file?.name ?? null);
        }}
      />
      <Button type="primary" loading={loading} onClick={() => void onImport(fileName)}>
        导入 DXF（Mock）
      </Button>
      <Typography.Text type="secondary">
        当前文件: {fileName ?? "未选择，使用默认示例"}
      </Typography.Text>
    </Space>
  );
}
