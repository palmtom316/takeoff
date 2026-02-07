# Takeoff V1 (WSL + Windows)

参数化管沟/管井算量桌面应用初始化骨架（Tauri v2 + React + TypeScript + Rust core）。

## 1. Repo placement (important)

推荐把仓库放在 Windows 盘并从 WSL 访问，例如：`/mnt/c/dev/takeoff`。

这样可以保证：
- WSL 可直接开发和跑测试。
- Windows PowerShell 可直接运行 `tauri dev/build`。

## 2. Environment setup

### WSL (Ubuntu)

```bash
node -v
npm -v
rustc -V
cargo -V
```

用于：编辑代码、跑单元测试（前端 + Rust core）。

### Windows PowerShell

需要安装：
- Node.js 22+
- Rust (MSVC target via rustup)
- Visual Studio C++ Build Tools
- WebView2 Runtime

用于：运行/打包桌面端。

## 3. Install dependencies

```bash
npm install
```

## 4. Development commands

### WSL: tests

```bash
npm run test -- --run
cargo test -p core-engine --manifest-path src-tauri/Cargo.toml
```

### Windows PowerShell: desktop app

```powershell
npm run tauri:dev
npm run tauri:build
```

## 5. Mock workflow demo

1. 启动应用后点击 `导入 DXF（Mock）`。
2. 查看 DraftModel 预览（至少 1 条 trench + 1 座 manhole）。
3. 点击 `执行算量`，查看明细行和单位汇总。

当前 DXF 解析为 mock 实现，后续将替换为真实 DXF parser。

## 6. Example files

- `examples/sample-project.v1.json`: 最小示例工程。
- `examples/mock-input.dxf`: DXF 占位输入文件。

## 7. Project structure

- `src/`: React UI + Tauri invoke client
- `src-tauri/`: Tauri desktop shell
- `src-tauri/crates/core-engine/`: Rust pure logic core
- `.github/workflows/ci.yml`: Windows CI (frontend tests + Rust core tests)
