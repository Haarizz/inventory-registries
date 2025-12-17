import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';

// Import your pages
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Departments from './components/Departments';
import Brands from './components/Brands';
import Units from './components/Units';
import StockTaking from './components/StockTaking';
import PriceLevels from './components/PriceLevels';
import SubDepartments from './components/SubDepartments';

function App() {
  return (
    <Router>
      <Sidebar>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route>         
            <Route path="/departments" element={<Departments />} />
            <Route path="/sub-departments" element={<SubDepartments />} />
          </Route>
 
          <Route path="/brands" element={<Brands />} />
          <Route path="/units" element={<Units />} />
          <Route path="/stock-taking" element={<StockTaking />} />
          <Route path="/price-levels" element={<PriceLevels />} />
        </Routes>
      </Sidebar>
    </Router>
  );
}

export default App;