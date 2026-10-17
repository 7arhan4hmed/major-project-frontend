import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, StockStatus } from '../types';
import {
  Boxes,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Package,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { AddProductModal } from '../components/modals/AddProductModal';

export const ProductsPage: React.FC = () => {
  const { products, updateStock, adjustStockDelta } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [addProductOpen, setAddProductOpen] = useState(false);

  // Statistics
  const totalSkus = products.length;
  const totalAvailableUnits = products.reduce((acc, p) => acc + p.availableStock, 0);
  const totalReservedUnits = products.reduce((acc, p) => acc + p.reservedStock, 0);
  const totalValuation = products.reduce((acc, p) => acc + (p.price * p.availableStock), 0);
  const lowStockCount = products.filter(p => p.status === 'LOW_STOCK' || p.status === 'OUT_OF_STOCK').length;

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = categoryFilter === 'ALL' || p.category === categoryFilter;
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-5 h-5 text-blue-600" />
            <span>Products & Real-Time Inventory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Distributed stock allocation, automatic inventory reservations & Kafka sync
          </p>
        </div>

        <button
          onClick={() => setAddProductOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Total Catalog SKUs
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {totalSkus}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across 5 primary categories</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Available Warehouse Units
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {totalAvailableUnits}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Ready for fulfillment</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Reserved SAGA Units
          </div>
          <div className="text-xl font-bold font-mono text-blue-600 tabular-nums">
            {totalReservedUnits}
          </div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">Locked by active checkouts</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Inventory Valuation
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            ${totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Based on active MSRP</div>
        </div>
      </div>

      {/* Low Stock Warning Banner if any items low */}
      {lowStockCount > 0 && (
        <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Inventory Warning:</strong> {lowStockCount} product{lowStockCount > 1 ? 's are' : ' is'} at or below minimum threshold. Automatic replenishment events emitted.
            </span>
          </div>
          <button
            onClick={() => setStatusFilter('LOW_STOCK')}
            className="text-xs font-semibold text-amber-800 underline hover:text-amber-950 shrink-0"
          >
            Filter Low Stock
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by product name, SKU, or ID..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 shrink-0">Category:</label>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden"
            >
              <option value="ALL">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 shrink-0">Status:</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden"
            >
              <option value="ALL">All Stock Levels</option>
              <option value="IN_STOCK">In Stock</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">Product Name & SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Unit Price</th>
                <th className="px-4 py-3 text-center">Available Stock</th>
                <th className="px-4 py-3 text-center">Reserved</th>
                <th className="px-4 py-3">Stock Health Level</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(prod => {
                const maxCapacityRef = Math.max(100, prod.availableStock + prod.reservedStock + 20);
                const percent = Math.min(100, Math.round((prod.availableStock / maxCapacityRef) * 100));

                return (
                  <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{prod.name}</div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-0.5">
                        <span>{prod.sku}</span>
                        <span>·</span>
                        <span>{prod.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-medium">
                      {prod.category}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      ${prod.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-slate-900 tabular-nums text-sm">
                      {prod.availableStock}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-blue-600 font-semibold tabular-nums">
                      {prod.reservedStock}
                    </td>
                    <td className="px-4 py-3 min-w-[140px]">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span>{prod.availableStock} / min {prod.minThreshold}</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            prod.status === 'OUT_OF_STOCK'
                              ? 'bg-rose-500'
                              : prod.status === 'LOW_STOCK'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.max(4, percent)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          prod.status === 'IN_STOCK'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : prod.status === 'LOW_STOCK'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {prod.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200">
                        <button
                          onClick={() => adjustStockDelta(prod.id, -1)}
                          disabled={prod.availableStock <= 0}
                          className="w-6 h-6 rounded bg-white hover:bg-slate-200 disabled:opacity-40 text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                          title="Decrease Stock (-1)"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-mono text-xs font-bold text-slate-800">
                          {prod.availableStock}
                        </span>
                        <button
                          onClick={() => adjustStockDelta(prod.id, 1)}
                          className="w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                          title="Increase Stock (+1)"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredProducts.length} of {products.length} inventory products</span>
          <span className="font-mono text-[11px]">Real-Time Event: InventoryUpdated dispatched on changes</span>
        </div>
      </div>

      <AddProductModal
        isOpen={addProductOpen}
        onClose={() => setAddProductOpen(false)}
      />
    </div>
  );
};
