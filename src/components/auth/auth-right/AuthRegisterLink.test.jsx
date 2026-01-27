import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import AuthRegisterLink from "./AuthRegisterLink";

describe("AuthRegisterLink", () => {
  it("hiển thị đúng câu hỏi và link đăng ký", () => {
    render(
      <BrowserRouter>
        <AuthRegisterLink />
      </BrowserRouter>,
    );

    // Kiểm tra text câu hỏi
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();

    // Kiểm tra link chuyển trang
    const link = screen.getByRole("link", { name: /signup/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/register");

    // Kiểm tra class style như trong code của bạn
    expect(link).toHaveClass(
      "fw-semibold",
      "text-primary",
      "text-decoration-underline",
    );
  });
});
