import { render, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import MainLayouts from "./MainLayouts";

vi.mock("../../services/axios.customize.js", () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

describe("MainLayouts Tích hợp", () => {
  it("nên thay đổi data-sidebar-size khi nhấn toggle", async () => {
    const store = configureStore({
      reducer: {
        auth: (state = { isAuthenticated: true, user: { fullName: "Test User" } }) => state,
      },
    });

    let dom;
    await act(async () => {
      dom = render(
        <Provider store={store}>
          <MemoryRouter>
            <MainLayouts />
          </MemoryRouter>
        </Provider>,
      );
    });

    const toggleBtn = dom.container.querySelector("#topnav-hamburger-icon");

    await act(async () => {
      fireEvent.click(toggleBtn);
    });

    expect(document.body.getAttribute("data-sidebar-size")).toBe(
      "sm-hover",
    );
  });
});
