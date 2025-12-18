import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaSpinner,
  FaBoxOpen,
} from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const data = await login(formData.username, formData.password);

      // ✅ Store Auth Data
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("role", data.role);
      sessionStorage.setItem("user", data.username); // Optional: Store name for UI

      // Role-Based Redirect (Optional logic)
      // if (data.role === 'ADMIN') navigate('/admin');
      // else navigate('/dashboard');
      
      navigate("/"); 
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
      setIsLoading(false);
    }
  };

  // --- CSS STYLES ---
  const styles = `
    :root {
      --bg-body: #f3f4f6;
      --bg-card: #ffffff;
      --text-primary: #1f2937;
      --text-secondary: #6b7280;
      --primary-color: #2563eb;
      --primary-hover: #1d4ed8;
      --border-color: #e5e7eb;
      --error-color: #ef4444;
    }

    /* Dark Mode Support (if class added to body) */
    [data-theme='dark'] {
      --bg-body: #0f172a;
      --bg-card: #1e293b;
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --border-color: #334155;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--bg-body);
      font-family: 'Inter', sans-serif;
      padding: 20px;
      animation: fadeIn 0.5s ease-out;
    }

    .login-card {
      background: var(--bg-card);
      width: 100%;
      max-width: 420px;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-color);
      animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .brand-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .brand-icon {
      font-size: 3rem;
      color: var(--primary-color);
      margin-bottom: 16px;
      filter: drop-shadow(0 4px 6px rgba(37, 99, 235, 0.2));
    }

    .brand-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0 0 8px 0;
      letter-spacing: -0.025em;
    }

    .brand-subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin: 0;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .input-wrapper {
      position: relative;
    }

    .input-field {
      width: 100%;
      padding: 12px 16px 12px 44px; /* Space for left icon */
      font-size: 1rem;
      color: var(--text-primary);
      background: var(--bg-body);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      transition: all 0.2s;
      box-sizing: border-box;
    }

    .input-field:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
      background: var(--bg-card);
    }

    .input-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-secondary);
      font-size: 1rem;
      transition: color 0.2s;
    }

    .input-field:focus + .input-icon {
      color: var(--primary-color);
    }

    .toggle-pass {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 1rem;
      padding: 0;
      display: flex;
      align-items: center;
    }
    .toggle-pass:hover { color: var(--text-primary); }

    .login-btn {
      width: 100%;
      padding: 14px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.2s;
      margin-top: 10px;
    }

    .login-btn:hover:not(:disabled) {
      background: var(--primary-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .login-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .error-msg {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error-color);
      padding: 12px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 20px;
      text-align: center;
      border: 1px solid rgba(239, 68, 68, 0.2);
      animation: fadeIn 0.3s;
    }

    .spinner {
      animation: spin 1s linear infinite;
    }
    @keyframes spin { 100% { transform: rotate(360deg); } }
  `;

  return (
    <div className="login-container">
      <style>{styles}</style>
      
      <div className="login-card">
        {/* Header */}
        <div className="brand-header">
          <FaBoxOpen className="brand-icon" />
          <h1 className="brand-title">Inventory Login</h1>
          <p className="brand-subtitle">Enter your credentials to access the workspace.</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="form-group">
            <label className="label">Username</label>
            <div className="input-wrapper">
              <input
                className="input-field"
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                autoFocus
              />
              <FaUser className="input-icon" />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="label">Password</label>
            <div className="input-wrapper">
              <input
                className="input-field"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
              <FaLock className="input-icon" />
              <button
                type="button"
                className="toggle-pass"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <FaSpinner className="spinner" /> Authenticating...
              </>
            ) : (
              <>
                Sign In <FaArrowRight size={14} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;