import api from "./axiosConfig";

export const fetchStockTakings = () =>
  api.get("/api/stock-taking");

export const createStockTaking = (productId, physicalStock) =>
  api.post(`/api/stock-taking/product/${productId}`, null, {
    params: { physicalStock },
  });

export const deleteStockTaking = (id) =>
  api.delete(`/api/stock-taking/${id}`);
