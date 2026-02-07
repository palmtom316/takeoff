import { Table, Typography } from "antd";
import type { QuantityResult } from "../domain/types";

interface Props {
  result: QuantityResult | null;
}

export function QuantityResultView({ result }: Props) {
  if (!result) {
    return <Typography.Text type="secondary">尚未执行算量</Typography.Text>;
  }

  return (
    <div>
      <Typography.Title level={5}>算量结果</Typography.Title>
      <Table
        size="small"
        pagination={false}
        rowKey={(line) => `${line.component_id}-${line.line_tag}`}
        dataSource={result.lines}
        columns={[
          { title: "标签", dataIndex: "line_tag" },
          { title: "构件ID", dataIndex: "component_id" },
          { title: "说明", dataIndex: "description" },
          { title: "单位", dataIndex: "unit" },
          { title: "工程量", dataIndex: "quantity" }
        ]}
      />

      <Typography.Title level={5} style={{ marginTop: 12 }}>
        单位汇总
      </Typography.Title>
      {Object.entries(result.totals.by_unit).map(([unit, qty]) => (
        <Typography.Paragraph key={unit}>
          {unit}: {qty}
        </Typography.Paragraph>
      ))}
    </div>
  );
}
