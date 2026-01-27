import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import LoginPage from "./LoginPage";
import { renderWithProviders } from "@/test/test-utils";

describe("LoginPage - Layout & UI Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("nên render khung trang và card layout đúng class Bootstrap", () => {
    const { container } = renderWithProviders(<LoginPage />);
    expect(container.querySelector(".auth-page-wrapper")).toBeInTheDocument();
    expect(container.querySelector(".card")).toHaveClass(
      "card-bg-fill",
      "border-0",
    );
  });

  it("nên hiển thị đầy đủ các phần cốt lõi: Left, Right và Footer", () => {
    const { container } = renderWithProviders(<LoginPage />);

    // Kiểm tra Row chứa nội dung chính
    const mainRow = container.querySelector(".row.g-0");
    expect(mainRow).toBeInTheDocument();

    // Kiểm tra nút Sign In (từ AuthRight) và thông tin Footer
    expect(
      screen.getByRole("button", { name: /sign in|login/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/©/i)).toBeInTheDocument();
  });

  it("nên phản ứng đúng khi trạng thái auth đang loading", async () => {
    const { container } = renderWithProviders(<LoginPage />, {
      preloadedState: {
        auth: { loading: true },
      },
    });

    // Sử dụng waitFor để đợi React hoàn tất việc cập nhật DOM từ Redux state
    await waitFor(
      () => {
        const buttons = container.querySelectorAll("button");
        const signInBtn = Array.from(buttons).find(
          (b) => /sign in|login/i.test(b.textContent) || b.type === "submit",
        );

        if (signInBtn) {
          // Nếu nút tồn tại, nó bắt buộc phải ở trạng thái disabled
          expect(signInBtn).toBeDisabled();
        } else {
          // Nếu nút bị ẩn để hiện spinner, kiểm tra class spinner phổ biến
          const spinner =
            container.querySelector(".spinner-border") ||
            container.querySelector(".spinner-grow");
          expect(spinner).toBeInTheDocument();
        }
      },
      { timeout: 2000 },
    );
  });

  it("nên áp dụng các class responsive để tối ưu hiển thị", () => {
    const { container } = renderWithProviders(<LoginPage />);
    // col-lg-12 đảm bảo card full width trên màn hình lớn
    expect(container.querySelector(".col-lg-12")).toBeInTheDocument();
    expect(container.querySelector(".pt-lg-5")).toBeInTheDocument();
  });

  it("nên có lớp bg-overlay để đảm bảo độ tương phản cho nội dung", () => {
    const { container } = renderWithProviders(<LoginPage />);
    expect(container.querySelector(".bg-overlay")).toBeInTheDocument();
  });
});
