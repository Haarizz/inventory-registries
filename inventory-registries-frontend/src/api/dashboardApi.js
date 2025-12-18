// src/api/dashboardApi.js

import { fetchBrands } from "./brandApi";
import { fetchDepartments } from "./departmentApi";
import { getSubDepartments } from "./subDepartmentApi";
import { fetchProducts } from "./productApi";
import { fetchUnits } from "./unitApi";
import { fetchPriceLevels } from "./priceLevelApi";
import { fetchStockTakings } from "./stockTakingApi";

/**
 * Dashboard Aggregation API
 * - JPA-aware
 * - ID or Object safe
 * - Never drops records
 */
export const fetchDashboardData = async () => {

  /* ================= FETCH CORE DATA ================= */

  const [
    brandsRes,
    departmentsRes,
    productsRes,
    unitsRes,
    stocksRes
  ] = await Promise.all([
    fetchBrands(),
    fetchDepartments(),
    fetchProducts(),
    fetchUnits(),
    fetchStockTakings()
  ]);

  const brands = brandsRes.data ?? [];
  const departments = departmentsRes.data ?? [];
  const products = productsRes.data ?? [];
  const units = unitsRes.data ?? [];
  const stocks = stocksRes.data ?? [];

  /* ================= LOOKUP MAPS ================= */

  const departmentMap = {};
  departments.forEach(d => {
    departmentMap[d.id] = d.name;
  });

  const productMap = {};
  products.forEach(p => {
    productMap[p.id] = p.name;
  });

  /* ================= SUB DEPARTMENTS ================= */

  let allSubDepartments = [];

  for (const dept of departments) {
    try {
      const res = await getSubDepartments(dept.id);
      allSubDepartments.push(...(res.data ?? []));
    } catch {
      /* silent */
    }
  }

  /* ================= PRICE LEVELS ================= */

  let allPriceLevels = [];

  for (const product of products) {
    try {
      const res = await fetchPriceLevels(product.id);
      allPriceLevels.push(...(res.data ?? []));
    } catch {
      /* silent */
    }
  }

  /* ================= STOCK METRICS ================= */

  let totalStockQty = 0;
  let lowStockItems = [];
  let outOfStockItems = [];

  stocks.forEach(s => {
    const qty = Number(s.quantity ?? s.physicalStock ?? 0);
    const minQty = Number(s.minQuantity ?? 5);

    totalStockQty += qty;

    if (qty === 0) outOfStockItems.push(s);
    if (qty <= minQty) lowStockItems.push(s);
  });

  /* ================= PRODUCTS BY DEPARTMENT ================= */

  const productsByDepartment = {};

  products.forEach(p => {
    // Prefer backend-provided name
    let deptName = p.department?.name;

    // Fallback via ID
    if (!deptName) {
      const deptId = p.department?.id ?? p.departmentId;
      deptName = departmentMap[deptId];
    }

    // Final fallback (never drop)
    if (!deptName) deptName = "Unassigned";

    productsByDepartment[deptName] =
      (productsByDepartment[deptName] || 0) + 1;
  });

  /* ================= STOCK BY PRODUCT ================= */

  const stockByProduct = stocks.map(s => {
    let productName = s.product?.name;

    if (!productName) {
      const productId = s.product?.id ?? s.productId;
      productName = productMap[productId];
    }

    if (!productName) productName = "Unknown Product";

    return {
      name: productName,
      quantity: Number(s.quantity ?? s.physicalStock ?? 0)
    };
  });

  /* ================= RECENT PRODUCTS ================= */

  const recentProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  /* ================= FINAL DASHBOARD OBJECT ================= */

  return {
    counts: {
      brands: brands.length,
      departments: departments.length,
      subDepartments: allSubDepartments.length,
      products: products.length,
      units: units.length,
      priceLevels: allPriceLevels.length,
      totalStockQty,
      lowStock: lowStockItems.length,
      outOfStock: outOfStockItems.length
    },
    productsByDepartment,
    stockByProduct,
    lowStockItems: lowStockItems.slice(0, 5),
    recentProducts
  };
};
