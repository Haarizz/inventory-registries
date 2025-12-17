import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaFileExport, 
  FaBoxOpen, 
  FaExclamationTriangle, 
  FaDollarSign, 
  FaCheck, 
  FaTimes, 
  FaSort
} from 'react-icons/fa';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productApi";


const Products = () => {
  // --- MOCK DATA ---
  const initialData = [
    { id: 1, code: 'PRD-001', name: 'Wireless Mouse M1', brand: 'Logitech', category: 'Electronics', price: 25.00, cost: 15.00, stock: 150, status: 'Active' },
    { id: 2, code: 'PRD-002', name: 'Office Chair Ergo', brand: 'Herman Miller', category: 'Furniture', price: 350.00, cost: 200.00, stock: 5, status: 'Active' }, 
    { id: 3, code: 'PRD-003', name: 'Budget Paper A4', brand: 'Generic', category: 'Stationery', price: 5.00, cost: 4.80, stock: 500, status: 'Active' },
    { id: 4, code: 'PRD-004', name: 'Mechanical Keyboard', brand: 'Keychron', category: 'Electronics', price: 89.00, cost: 60.00, stock: 45, status: 'Active' },
    { id: 5, code: 'PRD-005', name: 'Monitor Stand 4K', brand: 'Dell', category: 'Electronics', price: 120.00, cost: 80.00, stock: 12, status: 'Active' },
  ];

  // --- STATE MANAGEMENT ---
const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ id: null, code: '', name: '', brand: '', category: '', price: '', cost: '', stock: '' });
  const [errors, setErrors] = useState({});

  // --- ANALYTICS ---
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;
  const marginAlertCount = products.filter(p => ((p.price - p.cost) / p.price) < 0.1).length; 

  // --- CRUD LOGIC ---

  // 1. Validation Logic
  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Product name is required.";
    if (!formData.code) tempErrors.code = "Unique code is required.";
    if (!formData.price || formData.price <= 0) tempErrors.price = "Price must be > 0.";
    
    // Check Unique Code (Business Rule)
    if (!isEditMode && products.some(p => p.code === formData.code)) {
      tempErrors.code = "This Product Code already exists.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // 2. Add / Edit Product
const handleSave = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  // UI → backend DTO mapping
  const payload = {
    code: formData.code,
    name: formData.name,
    stock: formData.stock,

    sellingPrice: formData.price,
    costPrice: formData.cost,

    // TEMP IDs (until dropdowns are wired)
    brandId: 1,
    subDepartmentId: 1,
    unitId: 1,
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
    alert("Failed to save product");
  }
};



  // 3. Delete Logic
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this record?")) return;

  try {
    await deleteProduct(id);
    await loadProducts();
    setSelectedRows(selectedRows.filter((r) => r !== id));
  } catch (err) {
    console.error("Delete failed", err);
    alert("Delete failed");
  }
};


  // 4. Bulk Delete
  const handleBulkDelete = async () => {
  if (!window.confirm(`Delete ${selectedRows.length} items?`)) return;

  try {
    for (const id of selectedRows) {
      await deleteProduct(id);
    }
    setSelectedRows([]);
    await loadProducts();
  } catch (err) {
    console.error("Bulk delete failed", err);
    alert("Bulk delete failed");
  }
};


  // --- HELPER FUNCTIONS ---
  const openModal = (product = null) => {
  setErrors({});

  if (product) {
    setFormData({
      id: product.id,
      code: product.code,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      cost: product.cost,
      stock: product.stock,
    });
    setIsEditMode(true);
  } else {
    setFormData({
      id: null,
      code: "",
      name: "",
      brand: "",
      category: "",
      price: "",
      cost: "",
      stock: "",
    });
    setIsEditMode(false);
  }

  setShowModal(true);
};


  const closeModal = () => setShowModal(false);

  const toggleSelectAll = (e) => {
    if (e.target.checked) setSelectedRows(products.map(p => p.id));
    else setSelectedRows([]);
  };

  const toggleSelectRow = (id) => {
    if (selectedRows.includes(id)) setSelectedRows(selectedRows.filter(r => r !== id));
    else setSelectedRows([...selectedRows, id]);
  };

  // --- CSS STYLES (Dynamic for Dark Mode) ---
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
    /* Icon backgrounds adapt using transparency for Dark Mode compatibility */
    .icon-blue { background: rgba(37, 99, 235, 0.1); color: #3b82f6; }
    .icon-gray { background: rgba(107, 114, 128, 0.1); color: var(--text-secondary); }
    .icon-orange { background: rgba(217, 119, 6, 0.1); color: #d97706; }
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

    .action-group { display: flex; gap: 10px; }
    
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
    
    .btn-danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid transparent; }
    .btn-danger:hover { background: rgba(239, 68, 68, 0.2); border-color: #ef4444; }
    
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
    tbody tr { transition: background 0.1s; }
    tbody tr:hover { background-color: var(--hover-bg); }

    /* STATUS BADGES */
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
    .badge-success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .badge-warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    .badge-danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

    /* ACTION ICONS */
    .icon-action { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; font-size: 0.95rem; color: var(--text-secondary); transition: 0.2s; margin-left: 4px; }
    .icon-action:hover { background: var(--hover-bg); color: var(--text-primary); }
    .icon-action.delete:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

    /* CATEGORY TAG */
    .category-tag { background: var(--hover-bg); padding: 2px 8px; border-radius: 4px; fontSize: 0.8rem; color: var(--text-secondary); border: 1px solid var(--border-color); }

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
      width: 100%; max-width: 550px;
      border-radius: 16px; 
      border: 1px solid var(--border-color);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
      padding: 30px;
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      color: var(--text-primary);
    }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
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
    .error-msg { color: #ef4444; font-size: 0.75rem; margin-top: 5px; }
  `;

  useEffect(() => {
  loadProducts();
}, []);

const loadProducts = async () => {
  try {
    const res = await fetchProducts();

    const mapped = res.data.map(p => ({
      id: p.id,
      code: p.code,
      name: p.name,

      // backend → UI mapping
      brand: p.brand?.name || "",
      category: p.subDepartment?.name || "",

      price: p.sellingPrice,
      cost: p.costPrice,
      stock: p.stock ?? 0,
      status: p.active ? "Active" : "Inactive",
    }));

    setProducts(mapped);
  } catch (err) {
    console.error("Failed to load products", err);
  }
};



  return (
    <div className="page-wrapper">
      <style>{styles}</style>

      {/* 1. HEADER */}
      <div className="page-header">
        <div className="page-title">
          <h1>Product Registry</h1>
          <p>Manage inventory master data and stock levels.</p>
        </div>
      </div>

      {/* 2. ANALYTICS CARDS */}
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

      {/* 3. TOOLBAR */}
      <div className="toolbar-container">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input 
            className="search-input" 
            placeholder="Search products by name, code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="action-group">
          {selectedRows.length > 0 && (
            <button className="btn btn-danger" onClick={handleBulkDelete}>
              <FaTrash /> Delete ({selectedRows.length})
            </button>
          )}
          <button className="btn btn-outline" onClick={() => alert("Exporting CSV...")}>
            <FaFileExport /> Export
          </button>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <FaPlus /> Add Product
          </button>
        </div>
      </div>

      {/* 4. DATA TABLE */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{width: '40px'}}>
                <input type="checkbox" onChange={toggleSelectAll} checked={selectedRows.length === products.length && products.length > 0} />
              </th>
              <th>Code</th>
              <th>Product Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock Status</th>
              <th>Margin</th>
              <th style={{textAlign: 'right'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                p.code.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((product) => {
                const price = product.price ?? 0;
                const cost = product.cost ?? 0;

                const margin = price > 0 ? ((price - cost) / price) * 100 : 0;

                const isLowMargin = margin < 10;
                const isLowStock = product.stock < 10;

                return (
                  <tr key={product.id}>
                    <td>
                      <input type="checkbox" checked={selectedRows.includes(product.id)} onChange={() => toggleSelectRow(product.id)} />
                    </td>
                    <td style={{fontWeight: 600}}>{product.code}</td>
                    <td>
                      <div style={{fontWeight: 500}}>{product.name}</div>
                    </td>
                    <td>{product.brand}</td>
                    <td><span className="category-tag">{product.category}</span></td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      {isLowStock ? 
                        <span className="badge badge-warning">Low ({product.stock})</span> : 
                        <span className="badge badge-success">In Stock ({product.stock})</span>
                      }
                    </td>
                    <td>
                      {isLowMargin ? 
                        <span className="badge badge-danger">Low ({margin.toFixed(0)}%)</span> : 
                        <span className="badge badge-success" style={{background: 'var(--hover-bg)', color: 'var(--text-primary)'}}>Healthy</span>
                      }
                    </td>
                    <td style={{textAlign: 'right'}}>
                      <button className="icon-action" onClick={() => openModal(product)} title="Edit"><FaEdit /></button>
                      <button className="icon-action delete" onClick={() => handleDelete(product.id)} title="Delete"><FaTrash /></button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" style={{textAlign: 'center', padding: '40px', color: 'var(--text-secondary)'}}>
                  No products found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 5. MODAL FORM */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-panel">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: 700}}>{isEditMode ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={closeModal} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)'}}><FaTimes /></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-control">
                <label>Product Name <span style={{color: 'red'}}>*</span></label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. Wireless Mouse"
                />
                {errors.name && <p className="error-msg">{errors.name}</p>}
              </div>

              <div className="form-grid">
                <div className="form-control">
                  <label>Code <span style={{color: 'red'}}>*</span></label>
                  <input 
                    type="text" 
                    value={formData.code} 
                    onChange={(e) => setFormData({...formData, code: e.target.value})} 
                    placeholder="PRD-001"
                    disabled={isEditMode} // Cannot edit code once set
                  />
                  {errors.code && <p className="error-msg">{errors.code}</p>}
                </div>
                <div className="form-control">
                  <label>Brand</label>
                  <input 
                    type="text" 
                    value={formData.brand} 
                    onChange={(e) => setFormData({...formData, brand: e.target.value})} 
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-control">
                  <label>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="">Select Category...</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Stationery">Stationery</option>
                  </select>
                </div>
                <div className="form-control">
                  <label>Stock Qty</label>
                  <input 
                    type="number" 
                    value={formData.stock} 
                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} 
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-control">
                  <label>Selling Price ($) <span style={{color: 'red'}}>*</span></label>
                  <input 
                    type="number" 
                    value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} 
                  />
                  {errors.price && <p className="error-msg">{errors.price}</p>}
                </div>
                <div className="form-control">
                  <label>Cost Price ($)</label>
                  <input 
                    type="number" 
                    value={formData.cost} 
                    onChange={(e) => setFormData({...formData, cost: Number(e.target.value)})} 
                  />
                </div>
              </div>

              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px'}}>
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary"><FaCheck /> Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;