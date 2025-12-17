import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaCheck,
  FaSearch,
  FaClipboardList,
  FaExclamationTriangle,
  FaChartLine,
  FaTimes
} from "react-icons/fa";

import {
  fetchStockTakings,
  createStockTaking,
  deleteStockTaking,
} from "../api/stockTakingApi";

import { fetchProducts } from "../api/productApi";

const StockTaking = () => {
  // --- STATE ---
  const [records, setRecords] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  
  // Form State
  const [productId, setProductId] = useState("");
  const [physicalStock, setPhysicalStock] = useState("");
  const [showModal, setShowModal] = useState(false);

  // --- LOADING ---
  useEffect(() => {
    loadData();
    loadProducts();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetchStockTakings();
      setRecords(res.data);
    } catch (error) {
      console.error("Failed to load stock takings", error);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to load products", error);
    }
  };

  // --- HANDLERS ---
  const handleSave = async (e) => {
    e.preventDefault();
    if (!productId || physicalStock === "") {
      alert("Please select a product and enter physical stock.");
      return;
    }

    try {
      await createStockTaking(productId, physicalStock);
      setShowModal(false);
      setProductId("");
      setPhysicalStock("");
      loadData();
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to submit stock taking.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this audit record?")) return;
    try {
      await deleteStockTaking(id);
      loadData();
    } catch (error) {
      alert("Failed to delete record.");
    }
  };

  // --- ANALYTICS & FILTERING ---
  const filtered = records.filter((r) =>
    r.product?.name.toLowerCase().includes(search.toLowerCase())
  );

  const discrepancyCount = records.filter(r => r.variance !== 0).length;
  // Calculate net variance (sum of all variances)
  const netVariance = records.reduce((acc, curr) => acc + (curr.variance || 0), 0);

  // --- CSS STYLES (Standardized) ---
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
    .icon-red { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    .icon-purple { background: rgba(168, 85, 247, 0.1); color: #a855f7; }

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
    table { width: 100%; border-collapse: collapse; min-width: 800px; }
    thead { background: var(--hover-bg); border-bottom: 1px solid var(--border-color); }
    th { text-align: left; padding: 14px 20px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 600; letter-spacing: 0.05em; }
    td { padding: 16px 20px; border-bottom: 1px solid var(--border-color); color: var(--text-primary); font-size: 0.9rem; vertical-align: middle; }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover { background-color: var(--hover-bg); }

    /* BADGES & VARIANCE */
    .variance-positive { color: #10b981; font-weight: 600; }
    .variance-negative { color: #ef4444; font-weight: 600; }
    .variance-neutral { color: var(--text-secondary); }

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
      width: 100%; max-width: 450px;
      border-radius: 16px; 
      border: 1px solid var(--border-color);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
      padding: 30px;
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      color: var(--text-primary);
    }
    .form-control { margin-bottom: 16px; }
    .form-control label { display: block; font-size: 0.85rem; font-weight: 500; color: var(--text-primary); margin-bottom: 6px; }
    .form-control input, .form-control select { 
      width: 100%; padding: 10px; 
      border: 1px solid var(--border-color); 
      background: var(--bg-body);
      color: var(--text-primary);
      border-radius: 8px; font-size: 0.95rem; box-sizing: border-box; transition: 0.2s; 
    }
    .form-control input:focus, .form-control select:focus { border-color: #3b82f6; outline: none; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
  `;

  return (
    <div className="page-wrapper">
      <style>{styles}</style>

      {/* HEADER */}
      <div className="page-header">
        <div className="page-title">
          <h1>Stock Taking</h1>
          <p>Audit and reconcile physical inventory with system records.</p>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon icon-blue">
              <FaClipboardList />
            </div>
          </div>
          <div>
            <div className="stat-title">Total Audits</div>
            <div className="stat-value">{records.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon icon-red">
              <FaExclamationTriangle />
            </div>
          </div>
          <div>
            <div className="stat-title">Discrepancies</div>
            <div className="stat-value">{discrepancyCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon icon-purple">
              <FaChartLine />
            </div>
          </div>
          <div>
            <div className="stat-title">Net Variance</div>
            <div className="stat-value" style={{color: netVariance < 0 ? '#ef4444' : 'var(--text-primary)'}}>
              {netVariance > 0 ? "+" : ""}{netVariance}
            </div>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="toolbar-container">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            className="search-input"
            placeholder="Search audits by product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus /> New Stock Audit
        </button>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: 60 }}>
                <input type="checkbox" disabled />
              </th>
              <th>Product</th>
              <th>System Stock</th>
              <th>Physical Stock</th>
              <th>Variance</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((r) => {
                const variance = r.variance || 0;
                let varClass = "variance-neutral";
                if (variance > 0) varClass = "variance-positive";
                if (variance < 0) varClass = "variance-negative";

                return (
                  <tr key={r.id}>
                    <td><input type="checkbox" /></td>
                    <td style={{ fontWeight: 600 }}>{r.product?.name}</td>
                    <td>{r.systemStock}</td>
                    <td>{r.physicalStock}</td>
                    <td className={varClass}>
                      {variance > 0 ? "+" : ""}{variance}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button 
                        className="icon-action delete" 
                        onClick={() => handleDelete(r.id)} 
                        title="Delete Audit"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: 40, color: 'var(--text-secondary)' }}>
                  No stock taking records found.
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
                New Stock Taking
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text-secondary)" }}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-control">
                <label>Product <span style={{ color: "red" }}>*</span></label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  autoFocus
                >
                  <option value="">Select Product...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Current: {p.stock ?? 0})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label>Physical Count <span style={{ color: "red" }}>*</span></label>
                <input
                  type="number"
                  placeholder="Enter counted quantity"
                  value={physicalStock}
                  onChange={(e) => setPhysicalStock(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <FaCheck /> Submit Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StockTaking;