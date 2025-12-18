import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaBoxOpen,
  FaDollarSign,
  FaExclamationTriangle,
  FaSort
} from "react-icons/fa";

import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productApi";

import api from "../api/axiosConfig";

const Products = () => {
  // ---------------- STATE ----------------
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false); // New State for Error Modal
  const [errorMessage, setErrorMessage] = useState(""); // New State for Error Message
  
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    code: "",
    name: "",
    brandId: "",
    unitId: "",
    subDepartmentId: "",
    sellingPrice: "",
    costPrice: "",
    stock: 0,
  });

  const [errors, setErrors] = useState({});

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    loadProducts();
    loadMasters();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  const loadMasters = async () => {
    try {
      const [b, u, sd] = await Promise.all([
        api.get("/api/brands"),
        api.get("/api/units"),
        api.get("/api/sub-departments"),
      ]);

      setBrands(b.data.filter((x) => x.active !== false));
      setUnits(u.data.filter((x) => x.active !== false));
      setSubDepartments(sd.data.filter((x) => x.active !== false));
    } catch (err) {
      console.error("Failed to load master data", err);
    }
  };

  // ---------------- ANALYTICS ----------------
  const totalValue = products.reduce((acc, p) => acc + (p.sellingPrice * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;
  const marginAlertCount = products.filter(p => {
    const margin = p.sellingPrice > 0 ? ((p.sellingPrice - p.costPrice) / p.sellingPrice) : 0;
    return margin < 0.1; 
  }).length;

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const e = {};
    if (!formData.name) e.name = "Name required";
    if (!formData.code && !isEditMode) e.code = "Code required";
    if (!formData.brandId) e.brandId = "Brand required";
    if (!formData.unitId) e.unitId = "Unit required";
    if (!formData.subDepartmentId) e.subDepartmentId = "Category required";
    if (Number(formData.sellingPrice) <= 0) e.sellingPrice = "Invalid price";
    if (Number(formData.costPrice) < 0) e.costPrice = "Invalid cost";
    
    if (Number(formData.sellingPrice) < Number(formData.costPrice)) {
      e.sellingPrice = "Price < Cost";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ---------------- HANDLERS ----------------
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      code: formData.code,
      name: formData.name,
      brandId: Number(formData.brandId),
      unitId: Number(formData.unitId),
      subDepartmentId: Number(formData.subDepartmentId),
      sellingPrice: Number(formData.sellingPrice),
      costPrice: Number(formData.costPrice),
      stock: Number(formData.stock),
    };

    try {
      if (isEditMode) {
        await updateProduct(formData.id, payload);
      } else {
        await createProduct(payload);
      }
      await loadProducts();
      closeModal();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save product.");
    }
  };

  // ✅ UPDATED DELETE HANDLER
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      // Set specific error message and show modal
      setErrorMessage("Cannot delete this product because it is currently used in Price Levels or Stock Taking records.");
      setShowErrorModal(true);
    }
  };

  const openModal = (p = null) => {
    setErrors({});
    if (p) {
      setFormData({
        id: p.id,
        code: p.code,
        name: p.name,
        brandId: p.brand?.id || "",
        unitId: p.unit?.id || "",
        subDepartmentId: p.subDepartment?.id || "",
        sellingPrice: p.sellingPrice,
        costPrice: p.costPrice,
        stock: p.stock,
      });
      setIsEditMode(true);
    } else {
      setFormData({
        id: null,
        code: "",
        name: "",
        brandId: "",
        unitId: "",
        subDepartmentId: "",
        sellingPrice: "",
        costPrice: "",
        stock: 0,
      });
      setIsEditMode(false);
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  // ---------------- CSS STYLES (Standardized) ----------------
  const styles = `
    /* ANIMATIONS */
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .page-wrapper {
      padding: 0 10px;
      animation: fadeIn 0.6s ease-out;
      color: var(--text-primary);
    }

    /* HEADER */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .page-title h1 { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin: 0; }
    .page-title p { color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px; }

    /* STATS CARDS */
    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: var(--bg-sidebar);
      padding: 20px;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); }
    .stat-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px; }
    
    .stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
    .icon-blue { background: rgba(37, 99, 235, 0.1); color: #3b82f6; }
    .icon-gray { background: rgba(107, 114, 128, 0.1); color: var(--text-secondary); }
    .icon-orange { background: rgba(249, 115, 22, 0.1); color: #f97316; }
    .icon-red { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

    .stat-title { font-size: 0.85rem; font-weight: 500; color: var(--text-secondary); }
    .stat-value { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em; }

    /* TOOLBAR */
    .toolbar-container {
      background: var(--bg-sidebar);
      padding: 16px;
      border-radius: 12px 12px 0 0;
      border: 1px solid var(--border-color);
      border-bottom: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
    }
    .search-wrapper { position: relative; width: 320px; }
    .search-input {
      width: 100%;
      padding: 10px 12px 10px 40px;
      border: 1px solid var(--border-color);
      background: var(--bg-body);
      color: var(--text-primary);
      border-radius: 8px;
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); outline: none; }
    .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-secondary); }

    /* BUTTONS */
    .btn {
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: none;
      transition: all 0.2s;
    }
    .btn-primary { background: #2563eb; color: white; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2); }
    .btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); }
    .btn-outline { background: var(--bg-sidebar); border: 1px solid var(--border-color); color: var(--text-primary); }
    .btn-outline:hover { border-color: var(--text-secondary); background: var(--hover-bg); }

    /* TABLE */
    .table-wrapper {
      background: var(--bg-sidebar);
      border: 1px solid var(--border-color);
      border-radius: 0 0 12px 12px;
      overflow-x: auto;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    table { width: 100%; border-collapse: collapse; min-width: 900px; }
    thead { background: var(--hover-bg); border-bottom: 1px solid var(--border-color); }
    th { text-align: left; padding: 14px 20px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 600; letter-spacing: 0.05em; }
    td { padding: 16px 20px; border-bottom: 1px solid var(--border-color); color: var(--text-primary); font-size: 0.9rem; vertical-align: middle; }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover { background-color: var(--hover-bg); }

    /* BADGES */
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
    .badge-success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .badge-warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    .badge-danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

    /* ACTION ICONS */
    .icon-action { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; font-size: 0.95rem; color: var(--text-secondary); transition: 0.2s; margin-left: 4px; }
    .icon-action:hover { background: var(--hover-bg); color: var(--text-primary); }
    .icon-action.delete:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

    /* MODAL */
    .modal-backdrop {
      position: fixed; inset: 0; z-index: 100;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      animation: fadeIn 0.2s;
    }
    .modal-panel {
      background: var(--bg-sidebar); 
      width: 100%; max-width: 600px;
      border-radius: 16px; 
      border: 1px solid var(--border-color);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
      padding: 30px;
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      color: var(--text-primary);
    }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 4px; }
    .form-control { margin-bottom: 16px; }
    .form-control label { display: block; font-size: 0.85rem; font-weight: 500; color: var(--text-primary); margin-bottom: 6px; }
    
    .form-control input, .form-control select { 
      width: 100%; padding: 10px; 
      border: 1px solid var(--border-color); 
      background: var(--bg-body);
      color: var(--text-primary);
      border-radius: 8px; font-size: 0.95rem; box-sizing: border-box; transition: 0.2s; 
    }
    .form-control input:focus, .form-control select:focus { border-color: #2563eb; outline: none; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
    .form-control input:disabled { background: var(--hover-bg); opacity: 0.7; cursor: not-allowed; }
    .error-msg { color: #ef4444; font-size: 0.75rem; margin-top: 5px; }
  `;

  return (
    <div className="page-wrapper">
      <style>{styles}</style>

      {/* HEADER */}
      <div className="page-header">
        <div className="page-title">
          <h1>Product Registry</h1>
          <p>Manage inventory master data and stock levels.</p>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon icon-blue"><FaDollarSign /></div>
          </div>
          <div>
            <div className="stat-title">Total Inventory Value</div>
            <div className="stat-value">${totalValue.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon icon-gray"><FaBoxOpen /></div>
          </div>
          <div>
            <div className="stat-title">Total Products</div>
            <div className="stat-value">{products.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon icon-orange"><FaExclamationTriangle /></div>
          </div>
          <div>
            <div className="stat-title">Low Stock Alerts</div>
            <div className="stat-value">{lowStockCount}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon icon-red"><FaSort /></div>
          </div>
          <div>
            <div className="stat-title">Margin Alerts</div>
            <div className="stat-value">{marginAlertCount}</div>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="toolbar-container">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            className="search-input"
            placeholder="Search products by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FaPlus /> Add Product
        </button>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock Status</th>
              <th>Margin</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter(
                (p) =>
                  p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.code.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((p) => {
                const margin = p.sellingPrice > 0 
                  ? ((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100 
                  : 0;
                
                return (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.code}</td>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td>{p.brand?.name}</td>
                    <td>{p.subDepartment?.name}</td>
                    <td>${p.sellingPrice.toFixed(2)}</td>
                    <td>
                      {p.stock < 10 ? (
                        <span className="badge badge-warning">Low ({p.stock})</span>
                      ) : (
                        <span className="badge badge-success">In Stock ({p.stock})</span>
                      )}
                    </td>
                    <td>
                      {margin < 10 ? (
                        <span className="badge badge-danger">{margin.toFixed(0)}%</span>
                      ) : (
                        <span className="badge badge-success" style={{background: 'var(--hover-bg)', color: 'var(--text-primary)'}}>Healthy</span>
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button className="icon-action" onClick={() => openModal(p)} title="Edit">
                        <FaEdit />
                      </button>
                      <button className="icon-action delete" onClick={() => handleDelete(p.id)} title="Delete">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            {products.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: 40, color: 'var(--text-secondary)' }}>
                  No products found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                {isEditMode ? "Edit Product" : "New Product"}
              </h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text-secondary)" }}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSave}>
              {/* Row 1: Code & Name */}
              <div className="form-grid">
                <div className="form-control">
                  <label>Code <span style={{color: 'red'}}>*</span></label>
                  <input
                    placeholder="PRD-001"
                    value={formData.code}
                    disabled={isEditMode}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                  {errors.code && <div className="error-msg">{errors.code}</div>}
                </div>
                <div className="form-control">
                  <label>Product Name <span style={{color: 'red'}}>*</span></label>
                  <input
                    placeholder="Wireless Mouse"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <div className="error-msg">{errors.name}</div>}
                </div>
              </div>

              {/* Row 2: Brand & Category */}
              <div className="form-grid">
                <div className="form-control">
                  <label>Brand <span style={{color: 'red'}}>*</span></label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                  >
                    <option value="">Select Brand...</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                  {errors.brandId && <div className="error-msg">{errors.brandId}</div>}
                </div>
                <div className="form-control">
                  <label>Category <span style={{color: 'red'}}>*</span></label>
                  <select
                    value={formData.subDepartmentId}
                    onChange={(e) => setFormData({ ...formData, subDepartmentId: e.target.value })}
                  >
                    <option value="">Select Category...</option>
                    {subDepartments.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  {errors.subDepartmentId && <div className="error-msg">{errors.subDepartmentId}</div>}
                </div>
              </div>

              {/* Row 3: Unit & Stock */}
              <div className="form-grid">
                <div className="form-control">
                  <label>Unit (UoM) <span style={{color: 'red'}}>*</span></label>
                  <select
                    value={formData.unitId}
                    onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                  >
                    <option value="">Select Unit...</option>
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                  {errors.unitId && <div className="error-msg">{errors.unitId}</div>}
                </div>
                <div className="form-control">
                  <label>Stock Qty</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>

              {/* Row 4: Pricing */}
              <div className="form-grid">
                <div className="form-control">
                  <label>Selling Price ($) <span style={{color: 'red'}}>*</span></label>
                  <input
                    type="number"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                  />
                  {errors.sellingPrice && <div className="error-msg">{errors.sellingPrice}</div>}
                </div>
                <div className="form-control">
                  <label>Cost Price ($)</label>
                  <input
                    type="number"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  />
                  {errors.costPrice && <div className="error-msg">{errors.costPrice}</div>}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <FaCheck /> Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ ERROR MODAL FOR DELETION */}
      {showErrorModal && (
        <div className="modal-backdrop">
          <div className="modal-panel" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                width: '60px', height: '60px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' 
              }}>
                <FaExclamationTriangle style={{ fontSize: '1.8rem', color: '#ef4444' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 8px' }}>Deletion Failed</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {errorMessage}
              </p>
            </div>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setShowErrorModal(false)}
            >
              Okay, Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;