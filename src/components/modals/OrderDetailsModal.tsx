import React from 'react';
import { Order, OrderStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  RotateCcw,
  Layers,
  Calendar,
  DollarSign,
  User,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  const { cancelOrder, updateOrderStatus, setCurrentPage } = useApp();

  if (!order) return null;

  const isCancellable = order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED';

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateOrderStatus(order.id, e.target.value as OrderStatus);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-white font-mono">{order.id}</h3>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  order.orderStatus === 'CONFIRMED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : order.orderStatus === 'SHIPPED'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
                    : order.orderStatus === 'DELIVERED'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-400/30'
                    : order.orderStatus === 'CANCELLED'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                }`}
              >
                {order.orderStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Trace Correlation ID: {order.correlationId} · Created: {order.createdAt}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Order Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Customer</span>
              </span>
              <span className="text-xs font-bold text-slate-800 block mt-1">{order.customerName}</span>
              <span className="text-[11px] text-slate-500 truncate block">{order.customerEmail}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                <span>Payment</span>
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                  ${order.totalAmount.toFixed(2)}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    order.paymentStatus === 'SUCCESSFUL'
                      ? 'bg-emerald-100 text-emerald-800'
                      : order.paymentStatus === 'FAILED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">{order.paymentMethod}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Shipping Address</span>
              </span>
              <span className="text-xs text-slate-700 block mt-1 line-clamp-2">
                {order.shippingAddress}
              </span>
            </div>
          </div>

          {/* SAGA Microservice Timeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Order Lifecycle Timeline (Kafka Event Choreography)</span>
              </h4>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {order.timeline.map((step, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white ${
                      step.status === 'COMPLETED'
                        ? 'bg-emerald-600 text-white'
                        : step.status === 'FAILED'
                        ? 'bg-rose-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {step.status === 'COMPLETED' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : step.status === 'FAILED' ? (
                      <AlertCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{step.title}</span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-mono">
                          {step.service}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{step.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{step.description}</p>
                    {step.eventId && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-mono text-blue-600">
                        <span>Kafka Event:</span>
                        <span className="underline decoration-dotted">{step.eventId}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Purchased Line Items
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="px-4 py-2.5">Product SKU & Name</th>
                    <th className="px-4 py-2.5">Category</th>
                    <th className="px-4 py-2.5 text-right">Quantity</th>
                    <th className="px-4 py-2.5 text-right">Unit Price</th>
                    <th className="px-4 py-2.5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="px-4 py-2.5">
                        <div className="font-semibold text-slate-900">{item.productName}</div>
                        <div className="text-[11px] font-mono text-slate-400">{item.productId}</div>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600">{item.category}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-semibold text-slate-800">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-slate-600">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900 tabular-nums">
                        ${item.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50/80 border-t border-slate-200 font-bold text-xs">
                  <tr>
                    <td colSpan={4} className="px-4 py-2.5 text-right text-slate-700 uppercase tracking-wider">
                      Total Invoice Amount
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-blue-700 text-sm tabular-nums">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Override Status:</span>
            <select
              value={order.orderStatus}
              onChange={handleStatusChange}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="PLACED">PLACED</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {isCancellable && (
              <button
                onClick={() => {
                  cancelOrder(order.id);
                  onClose();
                }}
                className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cancel Order & Release Stock</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
