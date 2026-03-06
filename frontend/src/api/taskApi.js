import API from "./axios";

export const getTasks = (projectId) =>
  API.get(`/tasks?projectId=${projectId}`);

export const createTask = (data) =>
  API.post("/tasks", data);

export const updateTask = (id, data) =>
  API.put(`/tasks/${id}`, data);

export const deleteTask = (id) =>
  API.delete(`/tasks/${id}`);