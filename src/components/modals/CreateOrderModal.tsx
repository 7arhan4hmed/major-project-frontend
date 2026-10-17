import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2, ShoppingCart, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen, onClose }) => {
  const { products, placeOrder } = useApp();

  const [customerName, setCustomerName] = useState('Dr. Maya Patel');
  const [customerEmail, setCustomerEmail] = useState('maya.patel@biogenomics.org');
  const [shippingAddress, setShippingAddress] = useState('BioGenomics Labs, Building 4, Cambridge, MA 02142');
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'UPI / NetBanking' | 'Corporate PO' | 'Digital Wallet'>('Corporate PO');
  
  const [selectedItems, setSelectedItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: products[0]?.id || 'PROD-101', quantity: 1 }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate totals
  const calculatedTotal = selectedItems.reduce((acc, item) => {
    const prod = products.find(p => p.id === item.productId);
    return acc + (prod ? prod.price * item.quantity : 0);
  }, 0);

  const handleAddItem = () => {
    // Find first product not already selected, or default to first
    const availableProd = products.find(p => !selectedItems.some(i => i.productId === p.id && p.availableStock > 0));
    if (availableProd) {
      setSelectedItems([...selectedItems, { productId: availableProd.id, quantity: 1 }]);
    } else if (products.length > 0) {
      setSelectedItems([...selectedItems, { productId: products[0].id, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (index: number) => {
    if (selectedItems.length <= 1) return;
    setSelectedItems(selectedItems.filter((_, idx) => idx !== index));
  };

  const handleUpdateItem = (index: number, productId: string, quantity: number) => {
    setSelectedItems(prev =>
      prev.map((item, idx) => (idx === index ? { productId, quantity: Math.max(1, quantity) } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !customerEmail.trim() || !shippingAddress.trim()) {
      setErrorMsg('Please complete all customer and shipping fields.');
      return;
    }

    if (selectedItems.length === 0) {
      setErrorMsg('Please add at least one product to the order.');
      return;
    }

    // Validate stock
    for (const item of selectedItems) {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) {
        setErrorMsg('Selected product not found.');
        return;
      }
      if (prod.availableStock < item.quantity) {
        setErrorMsg(`Insufficient stock for "${prod.name}". Only ${prod.availableStock} units available.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const result = await placeOrder({
        customerName,
        customerEmail,
        shippingAddress,
        items: selectedItems,
        paymentMethod
      });

      if (result.success && result.orderId) {
        setSuccessOrderId(result.orderId);
      } else {
        setErrorMsg(result.error || 'Failed to place order');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during order orchestration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Enterprise Order</h3>
              <p className="text-xs text-slate-400">
                Triggers Kafka SAGA: OrderPlaced → InventoryReserved → PaymentCompleted
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successOrderId ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Order Placed Successfully!</h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Order <strong className="font-mono text-slate-900">{successOrderId}</strong> has been published to the <code className="text-blue-600 font-mono">order.events</code> Kafka topic. Stock was automatically reserved and confirmation email dispatched.
            </p>
            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
              >
                Close & View Orders
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Customer Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer / Entity Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Email
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery / Shipping Destination
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={e => setShippingAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Product selection & stock validation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Order Line Items
                </label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {selectedItems.map((item, idx) => {
                  const currentProd = products.find(p => p.id === item.productId);
                  const isStockAvailable = currentProd ? currentProd.availableStock >= item.quantity : false;

                  return (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                    >
                      <div className="flex-1">
                        <select
                          value={item.productId}
                          onChange={e => handleUpdateItem(idx, e.target.value, item.quantity)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-hidden"
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id} disabled={p.availableStock <= 0}>
                              {p.name} — ${p.price.toFixed(2)} ({p.availableStock} in stock)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1.5">
                          <label className="text-[11px] font-semibold text-slate-500">Qty:</label>
                          <input
                            type="number"
                            min="1"
                            max={currentProd ? currentProd.availableStock : 1}
                            value={item.quantity}
                            onChange={e => handleUpdateItem(idx, item.productId, parseInt(e.target.value) || 1)}
                            className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-center font-mono font-bold text-slate-900 focus:outline-hidden"
                          />
                        </div>

                        <div className="w-24 text-right font-mono text-xs font-bold text-slate-800 tabular-nums">
                          ${((currentProd?.price || 0) * item.quantity).toFixed(2)}
                        </div>

                        {selectedItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Method & Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Simulated Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-hidden"
                >
                  <option value="Corporate PO">Corporate Purchase Order (PO)</option>
                  <option value="Credit Card">Corporate Credit Card (Stripe Mock)</option>
                  <option value="UPI / NetBanking">Bank Wire / NetBanking ACH</option>
                  <option value="Digital Wallet">Enterprise Digital Wallet</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  *Simulated authorization; no actual billing credentials requested.
                </p>
              </div>

              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Order Items:</span>
                  <span className="font-semibold text-slate-800">{selectedItems.length} SKUs</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-blue-200/60">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Estimated Total</span>
                  <span className="text-lg font-bold font-mono text-blue-700 tabular-nums">
                    ${calculatedTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Emitting Kafka Events...</span>
                  </>
                ) : (
                  <>
                    <span>Submit & Place Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
