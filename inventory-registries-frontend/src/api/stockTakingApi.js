import api from "./axiosConfig";

// -------------------- FETCH --------------------
export const fetchStockTakings = () =>
  api.get("/api/stock-taking");

// -------------------- CREATE (DRAFT) --------------------
export const createStockTaking = (productId, physicalStock) =>
  api.post(`/api/stock-taking/product/${productId}`, null, {
    params: { physicalStock },
  });

// -------------------- DELETE (only DRAFT) --------------------
export const deleteStockTaking = (id) =>
  api.delete(`/api/stock-taking/${id}`);

// -------------------- APPROVE --------------------
export const approveStockTaking = (id) =>
  api.post(`/api/stock-taking/${id}/approve`);

// -------------------- APPLY (updates product stock) --------------------
export const applyStockTaking = (id) =>
  api.post(`/api/stock-taking/${id}/apply`);
