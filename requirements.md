# Excel算量app — 参数化管沟/管井算量（桌面版）

## 0. 项目定位
本项目为跨平台桌面工程算量软件（Windows / macOS），
采用“参数化构件 + 规则算量”的方式完成工程量计算，
重点面向市政/园区管网中的 **管沟、管井** 场景。

不做 CAD/BIM 建模算量；
CAD/DXF 仅作为“参数输入来源之一”，
最终工程量统一由规则引擎计算，结果可追溯。

---

## 1. 技术栈与平台

### 1.1 平台
- Windows / macOS 桌面
- Web 非 V1 目标

### 1.2 技术栈
- Desktop Shell：Tauri v2
- UI：React + TypeScript
- UI Library：Ant Design
- Core Engine：Rust（纯逻辑，无 UI）
- 数据交换：JSON（serde）
- 工程文件：V1 使用 JSON

---

## 2. 总体架构

DXF
 ↓
CAD Parse（Polyline / Block / Text）
 ↓
Detect（图层映射 + 几何规则 + 文本解析）
 ↓
DraftModel（可编辑、可追溯）
 ↓
Instantiate（参数化构件实例）
 ↓
Rule Engine（算量 + 深度分段）
 ↓
Quantity Lines / Totals

### 架构原则
- Rust core 不依赖 UI
- 算量逻辑与输入来源解耦
- 所有工程量输出为“带标签明细行”
- 定额/清单编码属于映射层，不写死在 core
- 新构件通过 schema + calculator 扩展

---

## 3. CAD / DXF 输入策略

### 3.1 图纸来源
- 设计院 CAD 多为天正（T20）
- 天正原生 DWG 不作为 V1 直接解析对象

### 3.2 V1 工作流
- 天正 CAD → 转普通 CAD → 导出 DXF
- 软件导入 DXF 并自动识别
- 不要求人工大规模改图层，仅需确认/修正

---

## 4. DraftModel（草稿模型）

DraftModel 是 DXF 导入后的核心中间层，
必须可编辑、可保存、可复算。

---

## 5. 构件（V1）
### 5.1 管沟 TrenchSegment
- 路面结构层拆除 / 恢复
- 沟槽土石方（深度分段）
- 回填扣减

### 5.2 管井 Manhole
- 井坑开挖（深度分段）
- 井壁、底板混凝土
- 回填

---

## 6. 深度分段
- 可配置 depth bands
- 按 土 / 石 拆分

---

## 7. 非目标
- 不做 DWG 原生解析
- 不做扫描 PDF AI 提量
- 不做 BIM

---

## 8. 交付物
- Rust core
- Tauri + React 桌面端
- DXF 导入
- 示例工程
