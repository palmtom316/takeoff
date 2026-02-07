import { Table, Typography } from "antd";
import type { DraftModel } from "../domain/types";

interface Props {
  draft: DraftModel | null;
}

export function DraftPreview({ draft }: Props) {
  if (!draft) {
    return <Typography.Text type="secondary">尚未导入草稿模型</Typography.Text>;
  }

  return (
    <div>
      <Typography.Title level={5}>DraftModel 预览</Typography.Title>
      <Typography.Paragraph>Trench 数量: {draft.trenches.length}</Typography.Paragraph>
      <Typography.Paragraph>Manhole 数量: {draft.manholes.length}</Typography.Paragraph>

      <Table
        size="small"
        pagination={false}
        rowKey="id"
        dataSource={draft.trenches}
        title={() => "TrenchSegments"}
        columns={[
          { title: "ID", dataIndex: "id" },
          { title: "名称", dataIndex: "name" },
          { title: "长度(m)", dataIndex: "length_m" },
          { title: "宽度(m)", dataIndex: "width_m" },
          { title: "深度(m)", dataIndex: "depth_m" }
        ]}
      />

      <Table
        style={{ marginTop: 12 }}
        size="small"
        pagination={false}
        rowKey="id"
        dataSource={draft.manholes}
        title={() => "Manholes"}
        columns={[
          { title: "ID", dataIndex: "id" },
          { title: "名称", dataIndex: "name" },
          { title: "坑长(m)", dataIndex: "pit_length_m" },
          { title: "坑宽(m)", dataIndex: "pit_width_m" },
          { title: "坑深(m)", dataIndex: "pit_depth_m" }
        ]}
      />
    </div>
  );
}
