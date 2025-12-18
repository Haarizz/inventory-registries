import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom"; 
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaBoxOpen,
  FaBuilding,
  FaTags,
  FaBalanceScale,
  FaClipboardList,
  FaDollarSign,
  FaUserCircle,
  FaChevronLeft,
  FaChevronRight,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaCog // Added for Settings
} from "react-icons/fa";
import { hasRole, logout } from "../api/auth";
import { useNavigate } from "react-router-dom";


const Sidebar = ({ children }) => {
  // --- STATE ---
  const [collapsed, setCollapsed] = useState(false);

  // 1. Initialize state from LocalStorage
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("app-theme");
    return savedTheme === "dark"; 
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // State specifically for the Departments Dropdown
  const [deptOpen, setDeptOpen] = useState(false);
  const location = useLocation();

  // --- MOCK USER ROLE (Replace with actual auth logic) ---

  // 2. Save to LocalStorage whenever isDark changes
  useEffect(() => {
    localStorage.setItem("app-theme", isDark ? "dark" : "light");
  }, [isDark]);

  // --- RESPONSIVE HANDLER ---
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
        setCollapsed(false); 
      } else {
        setIsMobile(false);
        setMobileOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-expand dropdown if user navigates to a department page directly
  useEffect(() => {
    if (location.pathname === '/departments' || location.pathname === '/sub-departments') {
      setDeptOpen(true);
    }
  }, [location.pathname]);

  // --- MENU ITEMS ---
  const menuItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: <FaTachometerAlt />,
      roles: [
        "SUPER_ADMIN",
        "ADMIN",
        "MANAGER",
        "SUPERVISOR",
        "STAFF",
        "CASHIER",
        "ACCOUNTANT",
        "AUDITOR",
      ],
    },

    {
      id: "dept-group",
      label: "Departments",
      icon: <FaBuilding />,
      isDropdown: true,
      roles: ["SUPER_ADMIN", "ADMIN"],
      subItems: [
        { path: "/departments", label: "All Departments" },
        { path: "/sub-departments", label: "Sub-Departments" },
      ],
    },

    {
      path: "/brands",
      label: "Brands",
      icon: <FaTags />,
      roles: ["SUPER_ADMIN", "ADMIN"],
    },

    {
      path: "/units",
      label: "Units (UoM)",
      icon: <FaBalanceScale />,
      roles: ["SUPER_ADMIN", "ADMIN"],
    },

    {
      path: "/products",
      label: "Products / Services",
      icon: <FaBoxOpen />,
      roles: ["SUPER_ADMIN", "ADMIN", "MANAGER","STAFF"],
    },

    {
      path: "/stock-taking",
      label: "Stock Taking",
      icon: <FaClipboardList />,
      roles: ["SUPER_ADMIN", "ADMIN", "SUPERVISOR", "STAFF"],
    },

    {
      path: "/price-levels",
      label: "Price Levels",
      icon: <FaDollarSign />,
      roles: ["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"],
    },

    {
      path: "/settings",
      label: "Settings",
      icon: <FaCog />,
      roles: ["SUPER_ADMIN","ADMIN"],
    },

    {
      path: "/notifications",
      label: "Notifications",
      icon: <FaTachometerAlt />,
      roles: [
        "SUPER_ADMIN",
        "ADMIN"
      ],
    }
  ];

  
  
  const handleDeptClick = () => {
    if (collapsed) {
      setCollapsed(false);
      setTimeout(() => setDeptOpen(true), 150);
    } else {
      setDeptOpen(!deptOpen);
    }
  };
  const navigate = useNavigate();


  // --- STYLES (EXACT OLD UI PRESERVED) ---
  const css = `
    /* GLOBAL RESET */
    body, html {
      margin: 0; padding: 0; width: 100%; height: 100%;
      box-sizing: border-box;
    }

    :root {
      /* Light Theme (Default) */
      --bg-body: #f3f4f6;
      --bg-sidebar: #ffffff;
      --text-primary: #1f2937;
      --text-secondary: #6b7280;
      --hover-bg: #f3f4f6;
      --active-bg: #eff6ff;
      --active-text: #2563eb;
      --border-color: #e5e7eb;
      --user-bg: #f9fafb;
      --danger-bg: #fee2e2;
      --danger-text: #ef4444;
    }

    [data-theme='dark'] {
      /* Dark Theme */
      --bg-body: #0f172a;
      --bg-sidebar: #1e293b;
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --hover-bg: #334155;
      --active-bg: #3b82f6;
      --active-text: #ffffff;
      --border-color: #334155;
      --user-bg: #0f172a;
      --danger-bg: #450a0a;
      --danger-text: #f87171;
    }

    .app-container {
      display: flex;
      height: 100vh;
      width: 100vw;
      background-color: var(--bg-body);
      color: var(--text-primary);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      transition: background 0.3s ease;
      overflow: hidden;
    }

    /* SIDEBAR */
    .sidebar {
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-color);
      width: 280px;
      display: flex;
      flex-direction: column;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease;
      z-index: 50;
      position: relative;
      flex-shrink: 0;
    }

    .sidebar.collapsed { width: 88px; }

    /* HEADER */
    .sidebar-header {
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      border-bottom: 1px solid var(--border-color);
    }
    .sidebar.collapsed .sidebar-header { justify-content: center; padding: 0; }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 800;
      font-size: 0.875rem; 
      color: var(--active-text);
      white-space: nowrap;
      overflow: hidden;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* NAV LINKS */
    .nav-list {
      flex: 1;
      padding: 20px 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 14px;
      border-radius: 12px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
      color: var(--text-secondary);
      font-weight: 500;
      white-space: nowrap;
      position: relative;
      justify-content: space-between; /* For arrow alignment */
    }

    .nav-item:hover {
      background: var(--hover-bg);
      color: var(--text-primary);
    }

    .nav-item.active {
      background: var(--active-bg);
      color: var(--active-text);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    [data-theme='dark'] .nav-item.active {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
    }
    
    .nav-item-content { display: flex; align-items: center; }

    .nav-icon {
      font-size: 1.25rem;
      min-width: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-label {
      margin-left: 16px;
      font-size: 0.95rem;
      transition: opacity 0.2s;
    }
    .sidebar.collapsed .nav-label, .sidebar.collapsed .arrow-icon { display: none; }
    .sidebar.collapsed .nav-item { justify-content: center; padding: 14px 0; }

    /* --- DROPDOWN SUB-MENU STYLES --- */
    .sub-menu {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 2px;
      overflow: hidden;
    }
    
    .sub-item {
      display: flex;
      align-items: center;
      padding: 10px 14px 10px 54px; /* Indented text */
      text-decoration: none;
      color: var(--text-secondary);
      font-size: 0.9rem;
      border-radius: 12px;
      transition: 0.2s;
      position: relative;
    }

    .sub-item:hover {
      background: var(--hover-bg);
      color: var(--text-primary);
    }

    .sub-item.active {
      color: var(--active-text);
      font-weight: 600;
      background: rgba(37, 99, 235, 0.05); /* Very subtle active bg for sub items */
    }
    
    /* Small connector line for visual hierarchy */
    .sub-item::before {
      content: '';
      position: absolute;
      left: 36px;
      top: 50%;
      width: 6px;
      height: 1px;
      background: var(--border-color);
    }

    /* FOOTER */
    .sidebar-footer {
      padding: 20px;
      border-top: 1px solid var(--border-color);
      background-color: var(--bg-sidebar);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .sidebar.collapsed .sidebar-footer { padding: 20px 10px; }

    /* 1. USER CARD */
    .user-card {
      background: var(--user-bg);
      padding: 12px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      overflow: hidden;
      border: 1px solid var(--border-color);
    }
    .user-info { display: flex; flex-direction: column; white-space: nowrap; }
    .user-name { font-weight: 600; font-size: 0.9rem; color: var(--text-primary); }
    .user-email { font-size: 0.75rem; color: var(--text-secondary); }

    /* 2. THEME TOGGLE */
    .theme-toggle {
      background: var(--hover-bg);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      width: 100%;
      padding: 10px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: 0.2s;
    }
    .theme-toggle:hover { filter: brightness(0.95); }

    /* 3. SIGN OUT BUTTON */
    .signout-btn {
      width: 100%;
      padding: 10px;
      background: var(--hover-bg); 
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      border-radius: 8px;
      transition: all 0.2s;
    }
    
    .signout-btn:hover {
      background-color: var(--danger-bg);
      color: var(--danger-text);
      border-color: var(--danger-bg);
    }

    /* Collapsed State Logic */
    .sidebar.collapsed .user-info, 
    .sidebar.collapsed .theme-text,
    .sidebar.collapsed .signout-text { display: none; }
    
    .sidebar.collapsed .user-card { justify-content: center; padding: 12px 0; background: transparent; border: none; }
    .sidebar.collapsed .theme-toggle { padding: 10px 0; }
    .sidebar.collapsed .signout-btn { padding: 10px 0; }

    .icon-btn {
      background: none; border: none; color: var(--text-secondary);
      cursor: pointer; font-size: 1rem; padding: 8px; display: flex;
      align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .icon-btn:hover { background: var(--hover-bg); color: var(--text-primary); border-radius: 8px; }

    /* MOBILE */
    @media (max-width: 768px) {
      .sidebar { position: fixed; left: 0; top: 0; bottom: 0; transform: translateX(-100%); width: 280px !important; }
      .sidebar.mobile-open { transform: translateX(0); box-shadow: 10px 0 25px rgba(0,0,0,0.3); }
      .mobile-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 40; backdrop-filter: blur(2px); }
      .mobile-trigger { position: absolute; top: 15px; left: 15px; z-index: 60; background: var(--bg-sidebar); border: 1px solid var(--border-color); color: var(--text-primary); padding: 8px; border-radius: 6px; font-size: 1.2rem; }
    }
  `;

  return (
    <div className="app-container" data-theme={isDark ? "dark" : "light"}>
      <style>{css}</style>

      {/* Mobile Overlay & Trigger */}
      {isMobile && mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}
      {isMobile && !mobileOpen && (
        <button className="mobile-trigger" onClick={() => setMobileOpen(true)}>
          <FaBars />
        </button>
      )}

      {/* SIDEBAR */}
      <aside
        className={`sidebar ${collapsed ? "collapsed" : ""} ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >
        <div className="sidebar-header">
          {(!collapsed || isMobile) && (
            <div className="brand">
              <FaBoxOpen
                className="brand-icon"
                style={{ fontSize: "1.2rem", flexShrink: 0 }}
              />
              <span>Inventory</span>
            </div>
          )}

          {isMobile ? (
            <button className="icon-btn" onClick={() => setMobileOpen(false)}>
              <FaTimes />
            </button>
          ) : (
            <button
              className="icon-btn"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          )}
        </div>

        <nav className="nav-list">
          {menuItems
            .filter(
              (item) => !item.roles || item.roles.some((role) => hasRole(role))
            )
            .map((item, index) => {
              // --- RENDER DROPDOWN ITEM (DEPARTMENTS) ---
              if (item.isDropdown) {
                const isActiveParent =
                  location.pathname === "/departments" ||
                  location.pathname === "/sub-departments";
                return (
                  <div key={index}>
                    <div
                      className={`nav-item ${
                        isActiveParent && !deptOpen ? "active" : ""
                      }`}
                      onClick={handleDeptClick}
                      title={collapsed ? item.label : ""}
                    >
                      <div className="nav-item-content">
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                      </div>
                      {!collapsed && (
                        <span
                          className="arrow-icon"
                          style={{ fontSize: "0.8rem", opacity: 0.7 }}
                        >
                          {deptOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </span>
                      )}
                    </div>
                    {/* SUB MENU ITEMS */}
                    {deptOpen && !collapsed && (
                      <div className="sub-menu">
                        {item.subItems.map((sub, i) => (
                          <NavLink
                            key={i}
                            to={sub.path}
                            className="sub-item"
                            onClick={() => isMobile && setMobileOpen(false)}
                          >
                            {sub.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // --- RENDER STANDARD ITEMS ---
              return (
                <NavLink
                  key={index}
                  to={item.path}
                  className="nav-item"
                  title={collapsed ? item.label : ""}
                  onClick={() => isMobile && setMobileOpen(false)}
                >
                  <div className="nav-item-content">
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </div>
                </NavLink>
              );
            })}
        </nav>

        <div className="sidebar-footer">
          {/* 1. User Card */}
          <div className="user-card">
            <FaUserCircle size={32} color={isDark ? "#94a3b8" : "#cbd5e1"} />
            <div className="user-info">
              <span className="user-name">Gokul Admin</span>
              <span className="user-email">gokul@inventory.com</span>
            </div>
          </div>

          {/* 2. Theme Toggle */}
          <button className="theme-toggle" onClick={() => setIsDark(!isDark)}>
            {isDark ? <FaSun color="#f59e0b" /> : <FaMoon color="#6b7280" />}
            <span className="theme-text">
              {isDark ? "Light Mode" : "Dark Mode"}
            </span>
          </button>

          {/* 3. Sign Out Button */}
          <button
            className="signout-btn"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <FaSignOutAlt />
            <span className="signout-text">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main
        style={{
          flex: 1,
          padding: "30px",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {isMobile && <div style={{ height: "40px" }} />}
        {children}
      </main>
    </div>
  );
};

export default Sidebar;