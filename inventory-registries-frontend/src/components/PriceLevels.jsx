import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaDollarSign,
  FaTags,
  FaChartLine,
  FaArrowDown,
  FaArrowUp
} from "react-icons/fa";

import {
  fetchPriceLevels,
  createPriceLevel,
  updatePriceLevel,
  deletePriceLevel,
} from "../api/priceLevelApi";

import { fetchProducts } from "../api/productApi";

const PriceLevels = () => {
  // --- STATE ---
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [levels, setLevels] = useState([]);
  
  // Form State
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [priority, setPriority] = useState("");


  // --- LOADING ---
  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (productId) {
      loadPriceLevels(productId);
    } else {
      setLevels([]);
    }
  }, [productId]);

  const loadProducts = async () => {
    try {
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to load products", error);
    }
  };

  const loadPriceLevels = async (id) => {
    try {
      const res = await fetchPriceLevels(id);
      setLevels(res.data.sort((a, b) => a.priority - b.priority));

    } catch (error) {
      console.error("Failed to load price levels", error);
    }
  };

  // --- HANDLERS ---
  const openModal = (pl = null) => {
    setEditing(pl);
    setName(pl ? pl.name : "");
    setPrice(pl ? pl.price : "");
    setPriority(pl ? pl.priority : "");
    setShowModal(true);
  };


  const closeModal = () => {
    setEditing(null);
    setName("");
    setPrice("");
    setPriority("");
    setShowModal(false);
  };


  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || price === "") return alert("Name and Price are required");

    try {
      if (editing) {
        await updatePriceLevel(editing.id, {
          name,
          price,
          priority: Number(priority),
        });
      } else {
        await createPriceLevel(productId, {
          name,
          price,
          priority: Number(priority),
        });
      }
      closeModal();
      loadPriceLevels(productId);
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save price level");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this price level?")) return;
    try {
      await deletePriceLevel(id);
      loadPriceLevels(productId);
    } catch (error) {
      alert("Failed to delete");
    }
  };
  

  // --- ANALYTICS ---
  const minPrice = levels.length > 0 ? Math.min(...levels.map(l => Number(l.price))) : 0;
  const maxPrice = levels.length > 0 ? Math.max(...levels.map(l => Number(l.price))) : 0;

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
    .icon-green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .icon-blue { background: rgba(37, 99, 235, 0.1); color: #3b82f6; }
    .icon-orange { background: rgba(249, 115, 22, 0.1); color: #f97316; }

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
    .product-select-wrapper {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      max-width: 400px;
    }
    .product-select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--border-color);
      background: var(--bg-body);
      color: var(--text-primary);
      border-radius: 8px;
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .product-select:focus { border-color: #3b82f6; outline: none; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }

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
    .btn:disabled { background: var(--border-color); color: var(--text-secondary); cursor: not-allowed; transform: none; box-shadow: none; }
    .btn-outline { background: var(--bg-sidebar); border: 1px solid var(--border-color); color: var(--text-primary); }

    /* TABLE */
    .table-wrapper {
      background: var(--bg-sidebar);
      border: 1px solid var(--border-color);
      border-radius: 0 0 12px 12px;
      overflow-x: auto;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    table { width: 100%; border-collapse: collapse; min-width: 600px; }
    thead { background: var(--hover-bg); border-bottom: 1px solid var(--border-color); }
    th { text-align: left; padding: 14px 20px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 600; letter-spacing: 0.05em; }
    td { padding: 16px 20px; border-bottom: 1px solid var(--border-color); color: var(--text-primary); font-size: 0.9rem; vertical-align: middle; }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover { background-color: var(--hover-bg); }

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
    .form-control input { 
      width: 100%; padding: 10px; 
      border: 1px solid var(--border-color); 
      background: var(--bg-body);
      color: var(--text-primary);
      border-radius: 8px; font-size: 0.95rem; box-sizing: border-box; transition: 0.2s; 
    }
    .form-control input:focus { border-color: #2563eb; outline: none; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
  `;

  return (
    <div className="page-wrapper">
      <style>{styles}</style>

      {/* HEADER */}
      <div className="page-header">
        <div className="page-title">
          <h1>Price Levels</h1>
          <p>Manage multi-tier pricing strategies (Retail, Wholesale, etc.).</p>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon icon-blue">
              <FaTags />
            </div>
          </div>
          <div>
            <div className="stat-title">Active Tiers</div>
            <div className="stat-value">{productId ? levels.length : "-"}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon icon-green">
              <FaArrowDown />
            </div>
          </div>
          <div>
            <div className="stat-title">Lowest Price</div>
            <div className="stat-value">{productId ? `₹${minPrice}` : "-"}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon icon-orange">
              <FaArrowUp />
            </div>
          </div>
          <div>
            <div className="stat-title">Highest Price</div>
            <div className="stat-value">{productId ? `₹${maxPrice}` : "-"}</div>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="toolbar-container">
        <div className="product-select-wrapper">
          <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Product:
          </span>
          <select
            className="product-select"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">-- Select a Product to Manage Prices --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.code})
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => openModal()}
          disabled={!productId}
          title={!productId ? "Select a product first" : "Add Price Level"}
        >
          <FaPlus /> Add Price Level
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
              <th>Priority</th>
              <th>Tier Name</th>
              <th>Price (INR)</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!productId ? (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: "50px 20px",
                    color: "var(--text-secondary)",
                  }}
                >
                  <FaChartLine
                    style={{
                      fontSize: "2rem",
                      marginBottom: "10px",
                      opacity: 0.5,
                    }}
                  />
                  <br />
                  Please select a product from the dropdown above to view its
                  price levels.
                </td>
              </tr>
            ) : levels.length > 0 ? (
              levels.map((pl) => (
                <tr key={pl.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{pl.priority}</td>
                  <td style={{ fontWeight: 600 }}>
                    {pl.priority === 1 && "⭐ "}
                    {pl.name}
                  </td>
                  <td>₹ {Number(pl.price).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="icon-action"
                      onClick={() => openModal(pl)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-action delete"
                      onClick={() => handleDelete(pl.id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: 40,
                    color: "var(--text-secondary)",
                  }}
                >
                  No price levels found for this product. Add one to get
                  started.
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                {editing ? "Edit Price Level" : "New Price Level"}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  color: "var(--text-secondary)",
                }}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-control">
                <label>
                  Tier Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  placeholder="e.g. Wholesale, Retail, Distributor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="form-control">
                <label>
                  Priority (1 = highest) <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label>
                  Price (₹) <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 24,
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <FaCheck /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceLevels;