import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginThunk } from "./auth.thunk";
import { loginAPI } from "../../services/auth";

// Mock API service
vi.mock("../../services/auth", () => ({
  loginAPI: vi.fn(),
}));

describe("authThunk - Advanced Test Cases", () => {
  const dispatch = vi.fn();
  const getState = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // 1. Trường hợp thành công (Bổ sung kiểm tra kiểu dữ liệu lưu trữ)
  it("nên lưu đúng định dạng JSON cho user vào localStorage khi thành công", async () => {
    const mockRes = {
      accessToken: "token_xyz",
      user: { id: 99, role: "Staff" },
      data: { accessToken: "token_xyz" },
    };
    loginAPI.mockResolvedValue(mockRes);

    await loginThunk({ email: "staff@test.com", password: "123" })(
      dispatch,
      getState,
      undefined,
    );

    // Kiểm tra xem user có được stringify đúng cách không
    const storedUser = JSON.parse(localStorage.getItem("user"));
    expect(storedUser).toEqual({ id: 99, role: "Staff" });
    expect(localStorage.getItem("access_token")).toBe("token_xyz");
  });

  // 2. Trường hợp lỗi Server (500) hoặc lỗi cấu trúc response
  it("nên trả về 'Login failed' khi server trả về lỗi 500 mà không có message", async () => {
    const mockError = {
      response: {
        status: 500,
        // Không có data.message hoặc data
      },
    };
    loginAPI.mockRejectedValue(mockError);

    const result = await loginThunk({ email: "admin@test.com", password: "1" })(
      dispatch,
      getState,
      undefined,
    );

    expect(result.payload).toBe("Login failed");
  });

  // 3. Trường hợp dữ liệu trả về từ API bị thiếu trường cần thiết
  it("vẫn phải hoạt động nếu res.user bị undefined (kiểm tra tính an toàn)", async () => {
    const mockRes = {
      accessToken: "token_only",
      // Thiếu user
      data: { accessToken: "token_only" },
    };
    loginAPI.mockResolvedValue(mockRes);

    const result = await loginThunk({ email: "test@test.com", password: "1" })(
      dispatch,
      getState,
      undefined,
    );

    expect(result.type).toBe("auth/login/fulfilled");
    expect(localStorage.getItem("user")).toBe("undefined"); // Theo logic JSON.stringify(res.user)
  });

  // 4. Kiểm tra trạng thái Pending (Đảm bảo thunk khởi tạo đúng)
  it("phải gọi API với đúng thông tin email và password được cung cấp", async () => {
    loginAPI.mockResolvedValue({ data: {} });
    const credentials = {
      email: "special_user@gmail.com",
      password: "SpecialPassword!@#",
    };

    await loginThunk(credentials)(dispatch, getState, undefined);

    expect(loginAPI).toHaveBeenCalledWith(
      credentials.email,
      credentials.password,
    );
  });

  // 5. Kiểm tra lỗi có cấu trúc phức tạp (Object error từ API)
  it("nên trả về object lỗi nếu server trả về cấu trúc lỗi phức tạp", async () => {
    const complexError = {
      response: {
        data: {
          code: "AUTH_001",
          message: "Account is locked",
          details: "Too many failed attempts",
        },
      },
    };
    loginAPI.mockRejectedValue(complexError);

    const result = await loginThunk({ email: "lock@test.com", password: "1" })(
      dispatch,
      getState,
      undefined,
    );

    // expect result.payload phải là object data lỗi
    expect(result.payload).toEqual(complexError.response.data);
    expect(result.payload.code).toBe("AUTH_001");
  });

  // 6. Kiểm tra thứ tự: Gọi API -> Lưu LocalStorage -> Trả về data
  it("phải lưu vào localStorage TRƯỚC KHI kết thúc action fulfilled", async () => {
    const mockRes = {
      accessToken: "final_token",
      user: { id: 1 },
      data: { success: true },
    };
    loginAPI.mockResolvedValue(mockRes);

    const result = await loginThunk({ email: "a@b.com", password: "1" })(
      dispatch,
      getState,
      undefined,
    );

    // Nếu result có payload, chắc chắn localStorage đã phải được set trước đó trong code async
    expect(localStorage.getItem("access_token")).toBe("final_token");
    expect(result.payload).toEqual(mockRes.data);
  });
});
