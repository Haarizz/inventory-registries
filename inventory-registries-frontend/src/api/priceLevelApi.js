import api from "./axiosConfig";

export const fetchPriceLevels = (productId) =>
  api.get(`/api/price-levels/product/${productId}`);

export const createPriceLevel = (productId, data) =>
  api.post(`/api/price-levels/product/${productId}`, data);

export const updatePriceLevel = (id, data) =>
  api.put(`/api/price-levels/${id}`, data);

export const deletePriceLevel = (id) =>
  api.delete(`/api/price-levels/${id}`);

// ✅ NEW – Pricing priority resolution
export const fetchEffectivePrice = (productId) =>
  api.get(`/api/price-levels/product/${productId}/effective`);
