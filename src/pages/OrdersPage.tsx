import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus, PaymentStatus } from '../types';
import {
  ShoppingCart,
  Search,
  Filter,
  Plus,
  Eye,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { OrderDetailsModal } from '../components/modals/OrderDetailsModal';
import { CreateOrderModal } from '../components/modals/CreateOrderModal';

export const OrdersPage: React.FC = () => {
  const { orders, cancelOrder } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'createdAt' | 'totalAmount' | 'customerName'>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [createOrderOpen, setCreateOrderOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => {
        const matchesSearch =
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some(i => i.productName.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'ALL' || order.orderStatus === statusFilter;
        const matchesPayment = paymentFilter === 'ALL' || order.paymentStatus === paymentFilter;

        return matchesSearch && matchesStatus && matchesPayment;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];
        if (typeof valA === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [orders, searchTerm, statusFilter, paymentFilter, sortField, sortAsc]);

  const toggleSort = (field: 'createdAt' | 'totalAmount' | 'customerName') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner / Actions Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <span>Order Management & SAGA Tracker</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time event choreography across Order Service, Inventory Service, and Payment Service
          </p>
        </div>

        <button
          onClick={() => setCreateOrderOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Order</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by Order ID, customer, email, or product..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 shrink-0">Order Status:</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="PLACED">PLACED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 shrink-0">Payment:</label>
            <select
              value={paymentFilter}
              onChange={e => setPaymentFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden"
            >
              <option value="ALL">All Payments</option>
              <option value="SUCCESSFUL">SUCCESSFUL</option>
              <option value="PENDING">PENDING</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th
                  onClick={() => toggleSort('customerName')}
                  className="px-4 py-3 cursor-pointer hover:text-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Customer Details</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3">Ordered Items</th>
                <th
                  onClick={() => toggleSort('totalAmount')}
                  className="px-4 py-3 text-right cursor-pointer hover:text-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Amount</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Order Status</th>
                <th
                  onClick={() => toggleSort('createdAt')}
                  className="px-4 py-3 cursor-pointer hover:text-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Date Placed</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-600">No orders found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting your search terms or create a new order to test the pipeline.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {order.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{order.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{order.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-800 truncate max-w-[200px]" title={order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}>
                        {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {order.items.length} SKU{order.items.length > 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          order.paymentStatus === 'SUCCESSFUL'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : order.paymentStatus === 'FAILED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          order.orderStatus === 'CONFIRMED'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : order.orderStatus === 'SHIPPED'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : order.orderStatus === 'DELIVERED'
                            ? 'bg-teal-50 text-teal-700 border border-teal-200'
                            : order.orderStatus === 'CANCELLED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                      {order.createdAt}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors"
                        >
                          View SAGA
                        </button>
                        {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' && (
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                            title="Cancel Order (Compensation Transaction)"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredOrders.length} of {orders.length} orders</span>
          <span className="font-mono text-[11px]">Eventual Consistency · Kafka Partitioning by OrderID</span>
        </div>
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
      <CreateOrderModal
        isOpen={createOrderOpen}
        onClose={() => setCreateOrderOpen(false)}
      />
    </div>
  );
};
