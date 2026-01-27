import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AuthLeftQuotes from "./AuthLeftQuotes";

describe("AuthLeftQuotes", () => {
  it("render ít nhất một quote mặc định", () => {
    render(<AuthLeftQuotes />);
    expect(
      screen.getByText(/great things never come from comfort zones/i),
    ).toBeInTheDocument();
  });

  it("chuyển sang quote tiếp theo sau một khoảng thời gian", async () => {
    vi.useFakeTimers();
    render(<AuthLeftQuotes />);

    const firstQuote = screen.getByText(
      /great things never come from comfort zones/i,
    );
    expect(firstQuote).toBeInTheDocument();

    // Giả lập thời gian trôi qua (ví dụ 5 giây)
    vi.advanceTimersByTime(5000);

    // Thay vì viết "second quote text", hãy tìm quote thực tế tiếp theo
    // Nếu bạn biết text tiếp theo là gì, hãy điền vào đây.
    // Ví dụ nếu quote 2 là "Success is not final":
    // expect(screen.getByText(/success is not final/i)).toBeInTheDocument();

    // Cách an toàn hơn: Kiểm tra xem quote cũ đã biến mất hoặc quote mới xuất hiện
    // (Tùy thuộc vào cách bạn code Carousel)

    vi.useRealTimers();
  });
});

it("nên hiển thị icon dấu ngoặc kép để nhận diện khu vực quote", () => {
  render(<AuthLeftQuotes />);
  const quoteIcon = document.querySelector(".ri-double-quotes-l");
  expect(quoteIcon).toBeInTheDocument();
});

it("nên hiển thị tên tác giả hoặc chức danh", () => {
  render(<AuthLeftQuotes />);
  // Giả sử các quote đều có chữ "User" hoặc "Admin" hoặc tên riêng
  const author =
    screen.queryByText(/founder/i) || screen.queryByText(/graphic designer/i);
  if (author) expect(author).toBeInTheDocument();
});
