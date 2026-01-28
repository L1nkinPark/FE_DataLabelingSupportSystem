import "@testing-library/jest-dom";
import { vi } from "vitest";

// 1. Mock Fullscreen API (Sửa lỗi requestFullscreen is not a function)
Object.defineProperty(document, "documentElement", {
  value: {
    requestFullscreen: vi.fn().mockResolvedValue(undefined),
  },
  configurable: true,
});

document.exitFullscreen = vi.fn().mockResolvedValue(undefined);

Object.defineProperty(document, "fullscreenElement", {
  get: () => null,
  configurable: true,
});

// 2. Mock SVG getBBox (Sửa lỗi ApexCharts: getBBox is not a function)
if (!SVGElement.prototype.getBBox) {
  SVGElement.prototype.getBBox = () => ({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
}

// 3. Mock ApexCharts (Để tránh các lỗi rendering phức tạp trong test)
vi.mock("react-apexcharts", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-apexchart" />,
}));

vi.mock("apexcharts", () => ({
  __esModule: true,
  default: class {
    constructor() {}
    render() {
      return Promise.resolve();
    }
    destroy() {}
    updateOptions() {
      return Promise.resolve();
    }
  },
}));
