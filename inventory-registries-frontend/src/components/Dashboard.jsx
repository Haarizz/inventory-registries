import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, PieChart, Pie, Legend
} from "recharts";
import {
  Package, AlertTriangle, Activity, RefreshCw, TrendingUp, 
  PieChart as PieIcon, Layers, CheckCircle, ShoppingCart, Zap
} from "lucide-react";
import { fetchDashboardData } from "../api/dashboardApi";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchDashboardData();
      setData(res);
    } catch (err) {
      console.error("Dashboard Sync Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const barData = useMemo(() => {
    if (!data?.productsByDepartment) return [];
    return Object.entries(data.productsByDepartment)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <RefreshCw className="text-[#6366f1]" size={40} />
      </motion.div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      
      {/* Header - Weights matched to Brands.jsx */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border-color)] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Dashboard
          </h1>
          <p className="text-[var(--text-secondary)] text-sm font-normal mt-1">
            Overview of {data.counts.products} active registry lines.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-sidebar)] border border-[var(--border-color)] text-[var(--text-primary)] shadow-sm font-semibold text-sm transition-all"
        >
          <RefreshCw size={16} /> Sync Data
        </motion.button>
      </div>

      {/* KPI Cards - Balanced weights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Products" value={data.counts.products} icon={<Package />} color="blue" />
        <StatCard title="Low Stock" value={data.counts.lowStock} icon={<AlertTriangle />} color="red" />
        <StatCard title="Out of Stock" value={data.counts.outOfStock} icon={<ShoppingCart />} color="orange" />
        <StatCard title="Active Brands" value={data.counts.brands} icon={<Zap />} color="purple" />
      </div>

      {/* Charts Section - Fixed height fixes Screenshot (924) errors */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Distribution Bar Chart */}
        <div className="xl:col-span-2 bg-[var(--bg-sidebar)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm h-[400px]">
          <h3 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-[#6366f1]"/> Product Distribution
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 500}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 11}} />
                <Tooltip 
                  contentStyle={{background: 'var(--bg-sidebar)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px'}}
                  cursor={{fill: 'var(--hover-bg)'}}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Share Pie Chart */}
        <div className="bg-[var(--bg-sidebar)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm h-[400px]">
          <h3 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-6">
            <PieIcon size={18} className="text-[#10b981]"/> Market Share
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={barData} dataKey="value" innerRadius={60} outerRadius={85} paddingAngle={5} stroke="none">
                  {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', background: 'var(--bg-sidebar)', border: '1px solid var(--border-color)', fontSize: '12px'}} />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{fontSize: '11px', fontWeight: 500}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audit Table - Matches table style in Brands.jsx */}
        <div className="xl:col-span-3 bg-[var(--bg-sidebar)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center">
            <h3 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Layers size={18} className="text-[#f59e0b]"/> Registry Summary
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[var(--text-secondary)] text-[11px] uppercase tracking-wider font-semibold bg-[var(--hover-bg)] border-b border-[var(--border-color)]">
                  <th className="px-6 py-3">Product Name</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Stock Level</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {data.recentProducts.map((p, i) => (
                  <tr key={i} className="hover:bg-[var(--hover-bg)] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[var(--text-primary)] text-sm">{p.name}</p>
                      <p className="text-[10px] text-[var(--text-secondary)] font-mono">{p.code}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">₹{p.sellingPrice?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold ${p.stock < 10 ? 'text-red-500' : 'text-[#10b981]'}`}>{p.stock} units</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-[#10b981]/10 text-[#10b981]">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const themes = {
    blue: "bg-[#6366f1]/10 text-[#6366f1]",
    red: "bg-[#ef4444]/10 text-[#ef4444]",
    orange: "bg-[#f59e0b]/10 text-[#f59e0b]",
    purple: "bg-[#8b5cf6]/10 text-[#8b5cf6]"
  };
  return (
    <div className="bg-[var(--bg-sidebar)] p-5 rounded-2xl border border-[var(--border-color)] flex items-center gap-4 shadow-sm">
      <div className={`p-3 rounded-xl ${themes[color]}`}>{React.cloneElement(icon, { size: 20 })}</div>
      <div>
        <p className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{title}</p>
        <p className="text-xl font-bold text-[var(--text-primary)] mt-0.5">{value ?? 0}</p>
      </div>
    </div>
  );
};

export default Dashboard;