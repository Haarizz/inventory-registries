import api from "./axiosConfig";

// ---- Product APIs ----
export const fetchProducts = () => api.get("/api/products");
export const createProduct = (data) => api.post("/api/products", data);
export const updateProduct = (id, data) => api.put(`/api/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);
