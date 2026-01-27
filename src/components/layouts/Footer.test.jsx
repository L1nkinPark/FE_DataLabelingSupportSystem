import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "./Footer";

describe("Footer Component", () => {
  it("nên hiển thị đúng thông tin năm và thương hiệu", () => {
    render(<Footer />);
    expect(screen.getByText(/2024 © Velzon/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Design & Develop by Themesbrand/i),
    ).toBeInTheDocument();
  });
});
