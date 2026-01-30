import axios from "../axios.customize";

const projectService = {
  getReviewProjects: () => axios.get("/api/Project/reviewer/me"),
};

export default projectService;
