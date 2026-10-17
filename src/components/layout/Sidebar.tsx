import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavPage } from '../../types';
import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  CreditCard,
  Bell,
  Zap,
  Server,
  Terminal,
  Network,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  X
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    currentPage,
    setCurrentPage,
    orders,
    notifications,
    microservices,
    resetDemoData
  } = useApp();

  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const downServices = microservices.filter(s => s.status !== 'HEALTHY').length;

  const navItems: { id: NavPage; label: string; icon: React.ElementType; badge?: string | number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: orders.length },
    { id: 'products', label: 'Products & Inventory', icon: Boxes },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifs > 0 ? unreadNotifs : undefined,
      badgeColor: 'bg-blue-500'
    },
    { id: 'kafka', label: 'Kafka Event Stream', icon: Zap },
    {
      id: 'microservices',
      label: 'Microservices Health',
      icon: Server,
      badge: downServices > 0 ? `${downServices} degraded` : undefined,
      badgeColor: 'bg-amber-500'
    },
    { id: 'logs', label: 'System Logs', icon: Terminal },
    { id: 'architecture', label: 'Architecture', icon: Network }
  ];

  const handleNavClick = (page: NavPage) => {
    setCurrentPage(page);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">EventFlow</span>
                <span className="text-[10px] font-semibold text-blue-400 bg-blue-950/80 border border-blue-800/60 px-1.5 py-0.5 rounded">
                  DEMO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">Order & Inventory Platform</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Platform Modules
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      item.badgeColor
                        ? `${item.badgeColor} text-white`
                        : isActive
                        ? 'bg-blue-700 text-blue-100'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Quick Info & Reset */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80">
          <div className="rounded-lg bg-slate-800/80 p-3 mb-3 border border-slate-700/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Microservices & Kafka</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Enterprise event-driven architecture demonstration with SAGA pattern choreography.
            </p>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700/80 rounded-lg transition-colors border border-slate-700/50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </aside>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Reset Demo Environment?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              This will restore all orders, products, payments, Kafka event logs, and service health metrics to their pristine baseline demo values.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
