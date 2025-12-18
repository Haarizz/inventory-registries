import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

// Pages
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Departments from "./components/Departments";
import SubDepartments from "./components/SubDepartments";
import Brands from "./components/Brands";
import Units from "./components/Units";
import StockTaking from "./components/StockTaking";
import PriceLevels from "./components/PriceLevels";
import Settings from "./components/Settings";

// Route guards
import PrivateRoute from "./routes/PrivateRoute";
import RoleRoute from "./routes/RoleRoute";
import Login from "./pages/login";
import Notifications from "./components/Notifications";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔓 Public Route */}
        <Route path="/login" element={<Login />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Sidebar>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <RoleRoute
                        role={[
                          "SUPER_ADMIN",
                          "ADMIN",
                          "MANAGER",
                          "SUPERVISOR",
                          "STAFF",
                        ]}
                      >
                        <Dashboard />
                      </RoleRoute>
                    }
                  />

                  {/* Products */}
                  <Route
                    path="/products"
                    element={
                      <RoleRoute role="ADMIN|STAFF">
                        <Products />
                      </RoleRoute>
                    }
                  />

                  {/* Departments */}
                  <Route
                    path="/departments"
                    element={
                      <RoleRoute role="ADMIN">
                        <Departments />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="/sub-departments"
                    element={
                      <RoleRoute role="ADMIN">
                        <SubDepartments />
                      </RoleRoute>
                    }
                  />

                  {/* Brands */}
                  <Route
                    path="/brands"
                    element={
                      <RoleRoute role="ADMIN">
                        <Brands />
                      </RoleRoute>
                    }
                  />

                  {/* Units */}
                  <Route
                    path="/units"
                    element={
                      <RoleRoute role="ADMIN">
                        <Units />
                      </RoleRoute>
                    }
                  />

                  {/* Stock Taking */}
                  <Route
                    path="/stock-taking"
                    element={
                      <RoleRoute role="STAFF|ADMIN">
                        <StockTaking />
                      </RoleRoute>
                    }
                  />

                  {/* Price Levels */}
                  <Route
                    path="/price-levels"
                    element={
                      <RoleRoute role="ACCOUNTANT">
                        <PriceLevels />
                      </RoleRoute>
                    }
                  />

                  {/* Settings – SUPER ADMIN only */}
                  <Route
                    path="/settings"
                    element={
                      <RoleRoute role="SUPER_ADMIN">
                        <Settings />
                      </RoleRoute>
                    }
                  />

                  <Route
                    path="/notifications"
                    element={
                      <RoleRoute role="SUPER_ADMIN">
                        <Notifications />
                      </RoleRoute>
                    }
                  />
                </Routes>
              </Sidebar>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
