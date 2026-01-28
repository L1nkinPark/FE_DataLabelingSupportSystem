import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import MainLayouts from "./MainLayouts";

const mockStore = configureStore([]);

describe("MainLayouts Component", () => {
  let store;

  beforeEach(() => {
    // Khởi tạo store giả lập với đầy đủ các state mà Header và Navbar cần
    store = mockStore({
      auth: {
        isAuthenticated: true,
        user: { name: "Nguyễn Văn A", role: "Admin" },
      },
      task: { currentTask: null },
    });

    // Reset lại thuộc tính body trước mỗi test case
    document.body.removeAttribute("data-layout");
    document.body.removeAttribute("data-sidebar-size");
  });

  it("nên thiết lập các thuộc tính data-attributes lên thẻ body khi mount", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MainLayouts />
        </BrowserRouter>
      </Provider>,
    );

    // Kiểm tra useEffect đã chạy và set đúng giá trị mặc định
    expect(document.body.getAttribute("data-layout")).toBe("vertical");
    expect(document.body.getAttribute("data-sidebar-size")).toBe("lg");
  });

  it("nên thay đổi kích thước sidebar khi người dùng nhấn nút toggle trong Header", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MainLayouts />
        </BrowserRouter>
      </Provider>,
    );

    // Tìm nút hamburger bằng ID chính xác từ file Header.jsx của bạn
    const toggleBtn = document.getElementById("topnav-hamburger-icon");

    if (!toggleBtn) {
      // Debug nếu không tìm thấy nút
      screen.debug();
      throw new Error(
        "Không tìm thấy nút #topnav-hamburger-icon. Kiểm tra lại ID trong Header.jsx",
      );
    }

    // Thực hiện click
    fireEvent.click(toggleBtn);

    // Chờ cho đến khi thuộc tính trên body thay đổi (vì là cập nhật state bất đồng bộ)
    await waitFor(
      () => {
        expect(document.body.getAttribute("data-sidebar-size")).toBe(
          "sm-hover",
        );
      },
      { timeout: 2000 },
    );

    // Click lần nữa để quay lại size cũ
    fireEvent.click(toggleBtn);

    await waitFor(() => {
      expect(document.body.getAttribute("data-sidebar-size")).toBe("lg");
    });
  });

  it("nên xóa class 'sidebar-enable' khi click vào lớp phủ (overlay)", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MainLayouts />
        </BrowserRouter>
      </Provider>,
    );

    // Giả lập trạng thái sidebar đang mở trên mobile
    document.body.classList.add("sidebar-enable");

    // Tìm lớp phủ bằng class name
    const overlay = document.querySelector(".vertical-overlay");
    fireEvent.click(overlay);

    // Kiểm tra class đã bị xóa chưa
    expect(document.body.classList.contains("sidebar-enable")).toBe(false);
  });
});
