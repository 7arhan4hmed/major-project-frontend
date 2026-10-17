import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Payment, PaymentStatus } from '../types';
import {
  CreditCard,
  Search,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  ArrowUpDown,
  Lock
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export const PaymentsPage: React.FC = () => {
  const { payments, retryPayment } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [retryingId, setRetryingId] = useState<string | null>(null);

  // Statistics
  const totalProcessed = payments.length;
  const successfulCount = payments.filter(p => p.status === 'SUCCESSFUL').length;
  const failedCount = payments.filter(p => p.status === 'FAILED').length;
  const pendingCount = payments.filter(p => p.status === 'PENDING').length;
  const totalVolume = payments.reduce((acc, p) => p.status === 'SUCCESSFUL' ? acc + p.amount : acc, 0);

  const successRate = totalProcessed > 0 ? Math.round((successfulCount / totalProcessed) * 100) : 100;

  // Chart data
  const chartData = [
    { name: 'Successful', count: successfulCount, amount: payments.filter(p => p.status === 'SUCCESSFUL').reduce((a, b) => a + b.amount, 0), color: '#10B981' },
    { name: 'Pending', count: pendingCount, amount: payments.filter(p => p.status === 'PENDING').reduce((a, b) => a + b.amount, 0), color: '#F59E0B' },
    { name: 'Failed', count: failedCount, amount: payments.filter(p => p.status === 'FAILED').reduce((a, b) => a + b.amount, 0), color: '#F43F5E' }
  ];

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchesSearch =
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.transactionRef.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchesMethod = methodFilter === 'ALL' || p.paymentMethod === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [payments, searchTerm, statusFilter, methodFilter]);

  const handleRetry = async (paymentId: string) => {
    setRetryingId(paymentId);
    try {
      await retryPayment(paymentId);
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Simulation Disclaimer Alert */}
      <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start gap-3">
        <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-950 leading-relaxed">
          <strong>Simulated Payment Gateway:</strong> All financial transactions, authorization codes, and merchant charge IDs are mock data for this distributed system prototype. No actual credit card details or bank credentials are ever accepted or processed.
        </div>
      </div>

      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span>Payment Orchestration & Ledger</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Idempotent payment service, Kafka event publishing, and automated compensation retries
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Idempotency Key Guaranteed</span>
          </span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Settled Volume
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            ${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Across approved transactions</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Success Rate
          </div>
          <div className="text-xl font-bold font-mono text-emerald-600 tabular-nums">
            {successRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{successfulCount} of {totalProcessed} authorized</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Failed Charges
          </div>
          <div className="text-xl font-bold font-mono text-rose-600 tabular-nums">
            {failedCount}
          </div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">Retry eligible via SAGA</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Pending PO / Wires
          </div>
          <div className="text-xl font-bold font-mono text-amber-600 tabular-nums">
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Awaiting bank verification</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by Payment ID, Order ID, customer, transaction ref..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 shrink-0">Status:</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden"
            >
              <option value="ALL">All Outcomes</option>
              <option value="SUCCESSFUL">SUCCESSFUL</option>
              <option value="PENDING">PENDING</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 shrink-0">Method:</label>
            <select
              value={methodFilter}
              onChange={e => setMethodFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden"
            >
              <option value="ALL">All Methods</option>
              <option value="Corporate PO">Corporate PO</option>
              <option value="Credit Card">Credit Card</option>
              <option value="UPI / NetBanking">UPI / NetBanking</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">Payment ID</th>
                <th className="px-4 py-3">Order Ref</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Transaction Reference</th>
                <th className="px-4 py-3">Outcome</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3 text-right">Retry Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map(payment => (
                <tr key={payment.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">
                    {payment.id}
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-blue-600">
                    {payment.orderId}
                  </td>
                  <td className="px-4 py-3 text-slate-900 font-medium">
                    {payment.customerName}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {payment.paymentMethod}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                    {payment.transactionRef}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        payment.status === 'SUCCESSFUL'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : payment.status === 'FAILED'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {payment.status}
                    </span>
                    {payment.failureReason && (
                      <div className="text-[10px] text-rose-600 mt-1 max-w-[180px] truncate" title={payment.failureReason}>
                        {payment.failureReason}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                    {payment.timestamp}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {payment.status === 'FAILED' ? (
                      <button
                        onClick={() => handleRetry(payment.id)}
                        disabled={retryingId === payment.id}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-transparent rounded-lg transition-colors flex items-center gap-1 ml-auto"
                      >
                        <RotateCcw className={`w-3 h-3 ${retryingId === payment.id ? 'animate-spin' : ''}`} />
                        <span>{retryingId === payment.id ? 'Retrying...' : 'Retry Payment'}</span>
                      </button>
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredPayments.length} of {payments.length} payment records</span>
          <span className="font-mono text-[11px]">Payment Service → Kafka Topic: payment.events</span>
        </div>
      </div>
    </div>
  );
};
