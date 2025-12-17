import api from "./axiosConfig";

export const fetchUnits = () =>
  api.get("/api/units");

export const createUnit = (data) =>
  api.post("/api/units", data);

export const updateUnit = (id, data) =>
  api.put(`/api/units/${id}`, data);

export const deleteUnit = (id) =>
  api.delete(`/api/units/${id}`);
