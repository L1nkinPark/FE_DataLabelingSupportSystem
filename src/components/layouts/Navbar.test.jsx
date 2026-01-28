import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import Navbar from "./Navbar";

const mockStore = configureStore([]);

describe("Navbar Component", () => {
  it("nên hiển thị menu 'User Management' khi user là Admin", async () => {
    const store = mockStore({
      auth: { user: { role: "Admin" } },
      task: { currentTask: null },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>,
    );

    // 1. Tìm chính xác nút toggle "Settings" (là thẻ có role="button" hoặc link)
    // Cách này giúp phân biệt với thẻ tiêu đề (menu-title)
    const settingsToggle = screen.getByRole("button", { name: /settings/i });
    fireEvent.click(settingsToggle);

    // 2. Đợi "User Management" xuất hiện
    const userLink = await screen.findByText(
      /User Management/i,
      {},
      { timeout: 2000 },
    );
    expect(userLink).toBeInTheDocument();
  });

  it("không hiển thị menu Admin khi user là Annotator", () => {
    const store = mockStore({
      auth: { user: { role: "Annotator" } },
      task: { currentTask: null },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.queryByText(/User Management/i)).not.toBeInTheDocument();
  });
});
