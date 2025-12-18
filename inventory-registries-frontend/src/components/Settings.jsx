import React, { useState, useEffect } from "react";
import {
  FaUserShield,
  FaSearch,
  FaEdit,
  FaCheck,
  FaTimes,
  FaUsers,
  FaShieldAlt,
  FaEnvelope,
  FaUserCircle
} from "react-icons/fa";

import {
  fetchUsers,
  updateUserRole
} from "../api/settingsApi";

const Settings = () => {
  // --- STATE ---
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [tempRole, setTempRole] = useState("");

  // --- FETCH USERS ---
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(
        data.map(u => ({
          id: u.id,
          name: u.username,
          email: u.email || `${u.username.toLowerCase()}@system.com`,
          role: u.role,
          active: true // Entity defaults to active as field is missing in SQL
        }))
      );
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  // --- HANDLERS ---
  const handleEdit = (user) => {
    setEditingId(user.id);
    setTempRole(user.role);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTempRole("");
  };

  const handleSave = async (id) => {
    try {
      const updated = await updateUserRole(id, tempRole);
      setUsers(users.map(u =>
        u.id === id ? { ...u, role: updated.role } : u
      ));
      setEditingId(null);
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const toggleStatus = (id) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, active: !u.active } : u
    ));
  };

  // --- FILTER & STATS ---
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = users.filter(u => u.role === "ADMIN" || u.role === "SUPER_ADMIN").length;
  const activeCount = users.filter(u => u.active).length;

  // --- STYLES (Matched to Registry Modules) ---
  const styles = `
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .page-wrapper {
      padding: 0 10px;
      animation: fadeIn 0.6s ease-out;
      color: var(--text-primary);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .page-title h1 { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin: 0; }
    .page-title p { color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px; }

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
    .icon-green { background: rgba(16, 185, 129, 0.1); color: #10b981; }

    .stat-title { font-size: 0.85rem; font-weight: 500; color: var(--text-secondary); }
    .stat-value { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em; }

    .toolbar-container {
      background: var(--bg-sidebar);
      padding: 16px;
      border-radius: 12px 12px 0 0;
      border: 1px solid var(--border-color);
      border-bottom: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
    tbody tr:hover { background-color: var(--hover-bg); }

    /* ROLE COLOR BADGES */
    .role-badge { 
      padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; 
      display: inline-flex; align-items: center; gap: 6px; 
      text-transform: uppercase;
    }
    .role-SUPER_ADMIN { background: rgba(124, 58, 237, 0.1); color: #7c3aed; } /* Violet */
    .role-ADMIN { background: rgba(37, 99, 235, 0.1); color: #2563eb; } /* Blue */
    .role-MANAGER { background: rgba(13, 148, 136, 0.1); color: #0d9488; } /* Teal */
    .role-SUPERVISOR { background: rgba(219, 39, 119, 0.1); color: #db2777; } /* Pink */
    .role-STAFF, .role-CASHIER { background: rgba(75, 85, 99, 0.1); color: #4b5563; } /* Gray */
    .role-ACCOUNTANT { background: rgba(234, 179, 8, 0.1); color: #eab308; } /* Yellow */
    .role-AUDITOR { background: rgba(249, 115, 22, 0.1); color: #f97316; } /* Orange */

    .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; cursor: pointer; }
    .status-active { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .status-inactive { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

    .icon-action { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; font-size: 0.95rem; color: var(--text-secondary); transition: 0.2s; }
    .icon-action:hover { background: var(--hover-bg); color: var(--text-primary); }
    .icon-action.save { color: #10b981; }
    .icon-action.cancel { color: #ef4444; }

    .role-select {
      padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 6px;
      background: var(--bg-body); color: var(--text-primary); font-size: 0.85rem; font-weight: 500;
    }
  `;

  return (
    <div className="page-wrapper">
      <style>{styles}</style>

      <div className="page-header">
        <div className="page-title">
          <h1>Settings & Roles</h1>
          <p>Manage system users, access levels, and account permissions.</p>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-header"><div className="stat-icon icon-indigo"><FaUsers /></div></div>
          <div>
            <div className="stat-title">Total System Users</div>
            <div className="stat-value">{users.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header"><div className="stat-icon icon-teal"><FaUserShield /></div></div>
          <div>
            <div className="stat-title">Administrative Roles</div>
            <div className="stat-value">{adminCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header"><div className="stat-icon icon-green"><FaCheck /></div></div>
          <div>
            <div className="stat-title">Active Accounts</div>
            <div className="stat-value">{activeCount}</div>
          </div>
        </div>
      </div>

      <div className="toolbar-container">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            className="search-input"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: 60 }}>#</th>
              <th>Identity</th>
              <th>Email Address</th>
              <th>Permission Level</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((u) => (
                <tr key={u.id}>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{u.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FaUserCircle size={20} style={{ opacity: 0.3 }} />
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaEnvelope size={10} /> {u.email}
                    </div>
                  </td>
                  <td>
                    {editingId === u.id ? (
                      <select
                        className="role-select"
                        value={tempRole}
                        onChange={(e) => setTempRole(e.target.value)}
                        autoFocus
                      >
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="SUPERVISOR">SUPERVISOR</option>
                        <option value="STAFF">STAFF</option>
                        <option value="CASHIER">CASHIER</option>
                        <option value="ACCOUNTANT">ACCOUNTANT</option>
                        <option value="AUDITOR">AUDITOR</option>
                      </select>
                    ) : (
                      <span className={`role-badge role-${u.role}`}>
                        {(u.role === "ADMIN" || u.role === "SUPER_ADMIN") && <FaShieldAlt size={10} />}
                        {u.role}
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${u.active ? "status-active" : "status-inactive"}`}
                      onClick={() => toggleStatus(u.id)}
                      title="Toggle status (UI only)"
                    >
                      {u.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {editingId === u.id ? (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                        <button className="icon-action save" onClick={() => handleSave(u.id)} title="Commit">
                          <FaCheck />
                        </button>
                        <button className="icon-action cancel" onClick={handleCancel} title="Discard">
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <button className="icon-action" onClick={() => handleEdit(u)} title="Modify Role">
                        <FaEdit />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: 50, color: 'var(--text-secondary)' }}>
                  No users matched your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Settings;