import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WorkbenchPage } from "./WorkbenchPage";

describe("WorkbenchPage", () => {
  it("renders import and calculate actions", () => {
    render(<WorkbenchPage />);

    expect(screen.getByRole("button", { name: "导入 DXF（Mock）" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "执行算量" })).toBeInTheDocument();
  });

  it("runs parse and calculate flow", async () => {
    const user = userEvent.setup();
    render(<WorkbenchPage />);

    await user.click(screen.getByRole("button", { name: "导入 DXF（Mock）" }));

    await waitFor(() => {
      expect(screen.getByText("Trench 数量: 1")).toBeInTheDocument();
      expect(screen.getByText("Manhole 数量: 1")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "执行算量" }));

    await waitFor(() => {
      expect(screen.getByText("trench.excavation")).toBeInTheDocument();
      expect(screen.getByText("单位汇总")).toBeInTheDocument();
    });
  });
});
