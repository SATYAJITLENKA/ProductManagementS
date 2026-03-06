import API from "./axios";

export const getProjects = () => API.get("/projects");

export const getProject = (id) => API.get(`/projects/${id}`);

export const createProject = (data) => API.post("/projects", data);