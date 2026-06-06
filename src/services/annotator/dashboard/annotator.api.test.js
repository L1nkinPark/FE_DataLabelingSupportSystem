import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "/src/services/axios.customize.js";
import {
  getProfile,
  getAssignedProjects,
  getDashboardStats,
  getMyTasks,
  getReviewerFeedbackByProject,
  getAllReviewerFeedback,
} from "./annotator.api";

vi.mock("/src/services/axios.customize.js", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("Annotator API Suite - Full Coverage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getDashboardStats() - Các trường hợp biên", () => {
    it("TH Thành công: Tính toán đúng khi có nhiều trạng thái dự án", async () => {
      const mockProjects = [
        { status: "InProgress", totalImages: 10, completedImages: 4 },
        { status: "Completed", totalImages: 5, completedImages: 5 },
        { status: "Pending", totalImages: 20, completedImages: 0 },
      ];
      axios.get.mockResolvedValueOnce({ data: mockProjects });

      const stats = await getDashboardStats();

      expect(stats.totalAssigned).toBe(35);
      expect(stats.submitted).toBe(9);
      expect(stats.inProgress).toBe(6);
    });

    it("TH Dữ liệu thiếu: Nên trả về 0 nếu các field images bị undefined/null", async () => {
      const mockProjects = [{ status: "InProgress" }];
      axios.get.mockResolvedValueOnce({ data: mockProjects });

      const stats = await getDashboardStats();

      expect(stats.totalAssigned).toBe(0);
      expect(stats.inProgress).toBe(0);
    });

    it("TH Danh sách rỗng: Nên trả về object mặc định toàn số 0", async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      const stats = await getDashboardStats();
      expect(stats.totalAssigned).toBe(0);
      expect(stats.submitted).toBe(0);
    });
  });

  describe("getMyTasks()", () => {
    it("nên trả về mảng rỗng ngay lập tức nếu không truyền projectId", async () => {
      const result = await getMyTasks(undefined);
      expect(result).toEqual([]);
      expect(axios.get).not.toHaveBeenCalled();
    });

    it("nên gọi đúng URL endpoint khi có projectId", async () => {
      axios.get.mockResolvedValueOnce({ data: [{ id: 1 }] });
      await getMyTasks("PROJ_001");
      expect(axios.get).toHaveBeenCalledWith("/api/tasks/projects/PROJ_001/images");
    });
  });

  describe("getReviewerFeedbackByProject()", () => {
    it("nên trả về mảng rỗng nếu projectId rỗng", async () => {
      expect(await getReviewerFeedbackByProject("")).toEqual([]);
    });

    it("nên bắt lỗi (catch) và trả về [] khi server lỗi 500", async () => {
      axios.get.mockRejectedValueOnce(new Error("Internal Server Error"));
      const result = await getReviewerFeedbackByProject("P1");
      expect(result).toEqual([]);
    });
  });

  describe("getAllReviewerFeedback()", () => {
    it.skip("nên bỏ qua các dự án không có ID và thu thập feedback dự án hợp lệ", async () => {
      // Skipped as per original test file logic
    });

    it("nên trả về mảng rỗng nếu getAssignedProjects trả về null/undefined", async () => {
      axios.get.mockResolvedValueOnce({ data: null });
      const result = await getAllReviewerFeedback();
      expect(result).toEqual([]);
    });
  });

  describe("getProfile()", () => {
    it("getProfile nên trả về data từ res.data", async () => {
      const mockProfile = { id: "user_01", name: "Annotator 1" };
      axios.get.mockResolvedValueOnce({ data: mockProfile });

      const res = await getProfile();

      expect(axios.get).toHaveBeenCalledWith("/api/users/me");
      expect(res).toEqual(mockProfile);
    });
  });
});
