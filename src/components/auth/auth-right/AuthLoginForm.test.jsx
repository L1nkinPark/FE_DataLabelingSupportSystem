import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider, useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AuthLoginForm from "./AuthLoginForm";

// ================= MOCK REDUX HOOKS =================
vi.mock("react-redux", async () => {
  const actual = await vi.importActual("react-redux");
  return {
    ...actual,
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
  };
});

// ================= MOCK THUNK ACTION =================
vi.mock("@/store/auth/auth.thunk", () => ({
  loginThunk: vi.fn((payload) => ({
    type: "auth/login/fulfilled", // Khớp với type định nghĩa trong auth.thunk.js
    payload,
  })),
}));

describe("AuthLoginForm - Comprehensive Test", () => {
  const dispatchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDispatch).mockReturnValue(dispatchMock);

    // Trạng thái mặc định ban đầu (Chưa login, không load, không lỗi)
    vi.mocked(useSelector).mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
  });

  const renderUI = () =>
    render(
      <Provider
        store={{
          getState: () => ({ auth: { loading: false } }),
          subscribe: () => {},
          dispatch: dispatchMock,
        }}
      >
        <BrowserRouter>
          <AuthLoginForm />
        </BrowserRouter>
      </Provider>,
    );

  // --- 1. KIỂM TRA TRẠNG THÁI LOADING ---
  it("nút Sign In và các input phải bị disabled khi đang loading", () => {
    vi.mocked(useSelector).mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: true,
      error: null,
    });

    renderUI();

    // Trong code của bạn: {loading ? "Logging in..." : "Sign In"}
    const loadingBtn = screen.getByRole("button", {
      name: /logging in\.\.\./i,
    });
    expect(loadingBtn).toBeDisabled();

    // Kiểm tra các trường input cũng bị disabled theo thuộc tính disabled={loading}
    expect(screen.getByLabelText(/Email \/ Username/i)).toBeDisabled();
    expect(screen.getByPlaceholderText(/Enter password/i)).toBeDisabled();
  });

  // --- 2. KIỂM TRA LOGIC HIỂN THỊ LỖI (STRING & OBJECT) ---
  it("hiển thị chính xác thông báo lỗi từ API (xử lý cả trường hợp object có title)", () => {
    // Giả lập lỗi trả về là một object { title: "..." } như trong logic res.data của bạn
    vi.mocked(useSelector).mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: { title: "Invalid email or password" },
    });

    renderUI();
    expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
  });

  // --- 3. KIỂM TRA CHỨC NĂNG ẨN/HIỆN MẬT KHẨU ---
  it("thay đổi kiểu input từ password sang text khi click icon mắt", async () => {
    const user = userEvent.setup();
    renderUI();

    const passwordInput = screen.getByPlaceholderText(/Enter password/i);
    const toggleBtn = screen.getByLabelText(/toggle password visibility/i);

    // Mặc định là password
    expect(passwordInput).toHaveAttribute("type", "password");

    // Click lần 1 -> hiện
    await user.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "text");

    // Click lần 2 -> ẩn lại
    await user.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  // --- 4. KIỂM TRA SUBMIT FORM ---
  it("gửi thông tin đăng nhập đúng đến loginThunk khi nhấn Sign In", async () => {
    const user = userEvent.setup();
    renderUI();

    const emailInput = screen.getByLabelText(/Email \/ Username/i);
    const passwordInput = screen.getByPlaceholderText(/Enter password/i);
    const submitBtn = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "admin@gmail.com");
    await user.type(passwordInput, "Password123");
    await user.click(submitBtn);

    // Kiểm tra dispatch có được gọi với đúng payload không
    // Lưu ý: Code của bạn dùng: dispatch(loginThunk({ email, password }))
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: { email: "admin@gmail.com", password: "Password123" },
      }),
    );
  });

  // --- 5. KIỂM TRA REDIRECT KHI ĐÃ AUTHENTICATED ---
  it("không hiển thị form nếu người dùng đã đăng nhập thành công", () => {
    vi.mocked(useSelector).mockReturnValue({
      isAuthenticated: true,
      user: { role: "Admin", email: "admin@test.com" },
      loading: false,
      error: null,
    });

    const { container } = renderUI();
    // Trong code của bạn: if (isAuthenticated && user) return null;
    expect(container.firstChild).toBeNull();
  });

  // --- 6. KIỂM TRA TRƯỜNG BẮT BUỘC (HTML5 VALIDATION) ---
  it("các input email và password phải có thuộc tính required", () => {
    renderUI();
    expect(screen.getByLabelText(/Email \/ Username/i)).toBeRequired();
    expect(screen.getByPlaceholderText(/Enter password/i)).toBeRequired();
  });
});
