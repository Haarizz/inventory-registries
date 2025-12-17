import api from "./axiosConfig";

export const getSubDepartments = (departmentId) =>
  api.get(`/api/sub-departments/department/${departmentId}`);

export const createSubDepartment = (departmentId, data) =>
  api.post(`/api/sub-departments/department/${departmentId}`, data);

export const updateSubDepartment = (id, data) =>
  api.put(`/api/sub-departments/${id}`, data);

export const deleteSubDepartment = (id) =>
  api.delete(`/api/sub-departments/${id}`);
