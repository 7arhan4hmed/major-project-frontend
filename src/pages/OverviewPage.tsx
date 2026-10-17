import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingCart,
  DollarSign,
  Boxes,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  Eye,
  Radio,
  Layers,
  Activity
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Order, KafkaEvent } from '../types';
import { OrderDetailsModal } from '../components/modals/OrderDetailsModal';
import { EventDetailsModal } from '../components/modals/EventDetailsModal';
import { CreateOrderModal } from '../components/modals/CreateOrderModal';

export const OverviewPage: React.FC = () => {
  const {
    orders,
    products,
    payments,
    kafkaEvents,
    microservices,
    setCurrentPage,
    runDemoWorkflow
  } = useApp();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<KafkaEvent | null>(null);
  const [createOrderOpen, setCreateOrderOpen] = useState(false);

  // Calculations
  const totalOrders = orders.length;
  const ordersToday = orders.filter(o => o.createdAt.startsWith('2026-10-16')).length;
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'SUCCESSFUL')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const totalProductsInStock = products.reduce((acc, p) => acc + p.availableStock, 0);
  const lowStockCount = products.filter(p => p.status === 'LOW_STOCK' || p.status === 'OUT_OF_STOCK').length;

  const pendingPayments = payments.filter(p => p.status === 'PENDING');
  const pendingAmount = pendingPayments.reduce((acc, p) => acc + p.amount, 0);

  const totalEventsProcessed = kafkaEvents.length;

  // Chart Data: Orders over last 7 days (realistic trend)
  const last7DaysData = [
    { day: 'Oct 10', orders: 18, revenue: 12450 },
    { day: 'Oct 11', orders: 24, revenue: 16800 },
    { day: 'Oct 12', orders: 20, revenue: 14200 },
    { day: 'Oct 13', orders: 32, revenue: 21900 },
    { day: 'Oct 14', orders: 29, revenue: 19400 },
    { day: 'Oct 15', orders: 38, revenue: 27850 },
    { day: 'Oct 16', orders: 42 + orders.length, revenue: 31200 + totalRevenue }
  ];

  // Chart Data: Order Status Distribution
  const orderStatusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
    return acc;
  }, {});

  const orderStatusData = [
    { name: 'CONFIRMED', value: orderStatusCounts['CONFIRMED'] || 0, color: '#10B981' },
    { name: 'PROCESSING', value: orderStatusCounts['PROCESSING'] || 0, color: '#F59E0B' },
    { name: 'SHIPPED', value: orderStatusCounts['SHIPPED'] || 0, color: '#6366F1' },
    { name: 'DELIVERED', value: orderStatusCounts['DELIVERED'] || 0, color: '#0D9488' },
    { name: 'CANCELLED', value: orderStatusCounts['CANCELLED'] || 0, color: '#F43F5E' },
    { name: 'PLACED', value: orderStatusCounts['PLACED'] || 0, color: '#3B82F6' }
  ].filter(d => d.value > 0);

  // Chart Data: Payment Breakdown
  const successfulPaymentsCount = payments.filter(p => p.status === 'SUCCESSFUL').length;
  const failedPaymentsCount = payments.filter(p => p.status === 'FAILED').length;
  const pendingPaymentsCount = payments.filter(p => p.status === 'PENDING').length;

  const paymentComparisonData = [
    { name: 'Successful', count: successfulPaymentsCount, fill: '#10B981' },
    { name: 'Pending', count: pendingPaymentsCount, fill: '#F59E0B' },
    { name: 'Failed', count: failedPaymentsCount, fill: '#F43F5E' }
  ];

  // Chart Data: Inventory stock by category
  const categoryStock = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + p.availableStock;
    return acc;
  }, {});

  const inventoryCategoryData = Object.entries(categoryStock).map(([cat, qty]) => ({
    category: cat.split(' ')[0], // short label
    stock: qty
  }));

  const degradedCount = microservices.filter(s => s.status !== 'HEALTHY').length;

  return (
    <div className="space-y-6">
      {/* College Project Banner & Quick Demo Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              College Project Demonstration
            </span>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Microservices & Apache Kafka
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1 tracking-tight">
            EventFlow Enterprise Operations Console
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl leading-relaxed">
            Asynchronous order orchestration, real-time inventory reservation, and idempotent payment processing powered by Kafka event streams and SAGA choreography.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => runDemoWorkflow('SUCCESS')}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Order SAGA</span>
          </button>
          <button
            onClick={() => runDemoWorkflow('PAYMENT_FAILURE')}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Simulate Failure</span>
          </button>
          <button
            onClick={() => setCreateOrderOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Total Orders */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Orders</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {totalOrders}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% vs last week</span>
          </div>
        </div>

        {/* Orders Today */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Orders Today</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {ordersToday}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Active order queue
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+8.9% growth</span>
          </div>
        </div>

        {/* Products in Stock */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Inventory Units</span>
            <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {totalProductsInStock}
          </div>
          <div className="text-[11px] font-semibold text-amber-600 mt-1">
            {lowStockCount} items low stock
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Pay</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            ${pendingAmount.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {pendingPayments.length} transactions pending
          </div>
        </div>

        {/* Events Processed */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Kafka Events</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {totalEventsProcessed}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            ~142 msgs / min stream
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Orders Trend Area Chart (7 columns) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Order Throughput (Last 7 Days)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Daily order volume & gross transaction volume
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Live Stream
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7DaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="orderColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${val} orders`, 'Volume']}
                />
                <Area type="monotone" dataKey="orders" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#orderColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution Donut Chart (5 columns) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Order Status Distribution
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">{orders.length} active records</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Current state breakdown across fulfillment stages
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={value => <span className="text-xs text-slate-600 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Analytics: Payments and Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Payment Outcomes Bar Chart (5 columns) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Payment Verification Rates
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Simulated transaction reconciliation & fraud check
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              {Math.round((successfulPaymentsCount / (payments.length || 1)) * 100)}% Success
            </span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Stock by Category (7 columns) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Category Stock Availability
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Physical unit counts across enterprise warehouse clusters
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('products')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
            >
              <span>Manage SKUs</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${val} units`, 'Stock']}
                />
                <Bar dataKey="stock" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row: Recent Orders & Recent System Events */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Recent Orders
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Latest transactions orchestrated across microservices
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('orders')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
            >
              <span>All Orders ({orders.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-2.5">Order ID</th>
                  <th className="px-4 py-2.5">Customer</th>
                  <th className="px-4 py-2.5 text-right">Amount</th>
                  <th className="px-4 py-2.5">Payment</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {order.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800 truncate max-w-[120px]">
                        {order.customerName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
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
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded-md transition-colors"
                        title="View order details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent System Events (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-600" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Kafka Event Stream
                </h3>
                <p className="text-[11px] text-slate-500">Live broker publications</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentPage('kafka')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
            >
              <span>Explore Stream</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1 max-h-84 overflow-y-auto">
            {kafkaEvents.slice(0, 5).map(evt => (
              <div
                key={evt.eventId}
                onClick={() => setSelectedEvent(evt)}
                className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors text-left flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {evt.eventName}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                      {evt.topic}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2 font-mono">
                    <span>{evt.producerService}</span>
                    <span>→</span>
                    <span className="truncate">{evt.consumerService}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      evt.status === 'PROCESSED'
                        ? 'bg-emerald-50 text-emerald-700'
                        : evt.status === 'PUBLISHED'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {evt.status}
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    {evt.timestamp.split(' ')[1] || evt.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
            <span className="text-[11px] text-slate-500">
              Showing 5 of {kafkaEvents.length} simulated Kafka broker records
            </span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
      <EventDetailsModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
      <CreateOrderModal
        isOpen={createOrderOpen}
        onClose={() => setCreateOrderOpen(false)}
      />
    </div>
  );
};
