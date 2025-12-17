import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaLayerGroup,
  FaBuilding,
  FaCheck,
  FaTimes,
  FaSitemap
} from "react-icons/fa";

// Import Department API to populate the "Parent Department" dropdown
import { fetchDepartments } from "../api/departmentApi"; 
import {
  getSubDepartments,
  createSubDepartment,
  updateSubDepartment,
  deleteSubDepartment,
} from "../api/subDepartmentApi";

const SubDepartments = () => {
  // --- STATE ---
  const [subDepts, setSubDepts] = useState([]);
  const [departments, setDepartments] = useState([]); // For the dropdown
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({ name: "", departmentId: "" });

  // --- LOADING DATA ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 1. Fetch All Departments first (to map names and populate dropdown)
      const deptRes = await fetchDepartments();
      const allDepts = deptRes.data;
      setDepartments(allDepts);

      // 2. Fetch Sub-Departments for all departments
      // Note: In a real app, you might have a generic 'getAllSubDepartments' API. 
      // Here we simulate fetching all by iterating known departments (or adjust based on your actual API).
      let allSubDepts = [];
      for (const dept of allDepts) {
        try {
          const res = await getSubDepartments(dept.id);
          // Attach parent name for display
          const withParent = res.data.map(sd => ({ ...sd, parentName: dept.name, parentId: dept.id }));
          allSubDepts = [...allSubDepts, ...withParent];
        } catch (e) {
          console.warn(`No sub-depts for dept ${dept.id}`);
        }
      }
      setSubDepts(allSubDepts);
    } catch (error) {
      console.error("Failed to load data", error);
    }
  };

  // --- HANDLERS ---
  const openModal = (item = null) => {
    if (item) {
      setEditing(item);
      setFormData({ name: item.name, departmentId: item.parentId });
    } else {
      setEditing(null);
      // Default to first department if available
      setFormData({ name: "", departmentId: departments.length > 0 ? departments[0].id : "" });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setFormData({ name: "", departmentId: "" });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.departmentId) {
      alert("Name and Parent Department are required");
      return;
    }

    try {
      if (editing) {
        // Note: Usually updates don't change the parent ID, but logic depends on your backend
        await updateSubDepartment(editing.id, { name: formData.name });
      } else {
        await createSubDepartment(formData.departmentId, { name: formData.name });
      }
      closeModal();
      loadData();
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save sub-department");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sub-department?")) return;
    try {
      await deleteSubDepartment(id);
      loadData();
    } catch (error) {
      alert("Failed to delete");
    }
  };

  // Filter Logic
  const filtered = subDepts.filter((sd) =>
    sd.name.toLowerCase().includes(search.toLowerCase()) ||
    sd.parentName?.toLowerCase().includes(search.toLowerCase())
  );

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
    .icon-indigo { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
    .icon-teal { background: rgba(20, 184, 166, 0.1); color: #14b8a6; }

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
    table { width: 100%; border-collapse: collapse; min-width: 600px; }
    thead { background: var(--hover-bg); border-bottom: 1px solid var(--border-color); }
    th { text-align: left; padding: 14px 20px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 600; letter-spacing: 0.05em; }
    td { padding: 16px 20px; border-bottom: 1px solid var(--border-color); color: var(--text-primary); font-size: 0.9rem; vertical-align: middle; }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover { background-color: var(--hover-bg); }

    /* TAGS */
    .dept-tag { 
      background: rgba(37, 99, 235, 0.1); 
      color: #3b82f6; 
      padding: 4px 10px; 
      border-radius: 6px; 
      font-size: 0.8rem; 
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

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
    .form-control input:focus, .form-control select:focus { border-color: #2563eb; outline: none; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
  `;

  return (
    <div className="page-wrapper">
      <style>{styles}</style>

      {/* HEADER */}
      <div className="page-header">
        <div className="page-title">
          <h1>Sub-Departments</h1>
          <p>Manage organizational units within departments.</p>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon icon-indigo">
              <FaLayerGroup />
            </div>
          </div>
          <div>
            <div className="stat-title">Total Sub-Depts</div>
            <div className="stat-value">{subDepts.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon icon-teal">
              <FaSitemap />
            </div>
          </div>
          <div>
            <div className="stat-title">Parent Departments</div>
            <div className="stat-value">{departments.length}</div>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="toolbar-container">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            className="search-input"
            placeholder="Search sub-departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={() => openModal()}>
          <FaPlus /> Add Sub-Department
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
              <th>Sub-Department Name</th>
              <th>Parent Department</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((sd, index) => (
                <tr key={sd.id || index}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td style={{ fontWeight: 600 }}>{sd.name}</td>
                  <td>
                    <span className="dept-tag">
                      <FaBuilding size={10} /> {sd.parentName}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="icon-action"
                      onClick={() => openModal(sd)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-action delete"
                      onClick={() => handleDelete(sd.id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: 40, color: 'var(--text-secondary)' }}>
                  No sub-departments found.
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
                {editing ? "Edit Sub-Department" : "New Sub-Department"}
              </h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text-secondary)" }}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSave}>
              {/* Parent Department Selection */}
              <div className="form-control">
                <label>Parent Department <span style={{ color: "red" }}>*</span></label>
                <select 
                  value={formData.departmentId} 
                  onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                  disabled={!!editing} // Often you can't move sub-depts between parents easily
                >
                  <option value="">Select a Department...</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Name Input */}
              <div className="form-control">
                <label>Sub-Department Name <span style={{ color: "red" }}>*</span></label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Recruitment, Payroll, Helpdesk"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
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

export default SubDepartments;