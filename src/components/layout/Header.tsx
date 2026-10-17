import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Play,
  Check,
  ChevronDown,
  Layers,
  ArrowRight
} from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const {
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    microservices,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    runDemoWorkflow
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (demoRef.current && !demoRef.current.contains(e.target as Node)) {
        setDemoMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifs = notifications.filter(n => !n.read);
  const degradedServices = microservices.filter(s => s.status !== 'HEALTHY');
  const isAllHealthy = degradedServices.length === 0;

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    overview: { title: 'Overview Dashboard', subtitle: 'Real-time telemetry, KPI metrics & system events' },
    orders: { title: 'Order Management', subtitle: 'Distributed orders, saga orchestration & checkout lifecycles' },
    products: { title: 'Products & Inventory', subtitle: 'Catalog, multi-warehouse stock allocations & auto-replenishment' },
    payments: { title: 'Payment Processing', subtitle: 'Simulated payment gateway transactions, retries & idempotency' },
    notifications: { title: 'Notification Center', subtitle: 'Event-driven customer alerts, webhooks & audit logs' },
    kafka: { title: 'Kafka Event Stream', subtitle: 'Apache Kafka topic partitions, offsets & consumer group metrics' },
    microservices: { title: 'Microservices Health', subtitle: 'Distributed container runtime status & failure injection' },
    logs: { title: 'System Logs', subtitle: 'Unified structured logs with correlation IDs & trace propagation' },
    architecture: { title: 'System Architecture', subtitle: 'Component topology, Kafka event choreography & technology stack' }
  };

  const currentInfo = pageTitles[currentPage] || { title: 'EventFlow', subtitle: 'Enterprise Platform' };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Platform</span>
            <span>/</span>
            <span className="text-slate-700 capitalize font-semibold">{currentPage}</span>
          </div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight truncate">
            {currentInfo.title}
          </h1>
        </div>
      </div>

      {/* Center: Search Field */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search orders, SKUs, events, correlation IDs..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* System Health Badge (Clickable) */}
        <button
          onClick={() => setCurrentPage('microservices')}
          className={`hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            isAllHealthy
              ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-700 hover:bg-emerald-100/60'
              : 'bg-amber-50/80 border-amber-300 text-amber-800 hover:bg-amber-100'
          }`}
          title="Click to view microservices health"
        >
          {isAllHealthy ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>All Services Healthy</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{degradedServices.length} Service Degraded</span>
            </>
          )}
        </button>

        {/* Demo Workflow Runner Button */}
        <div className="relative" ref={demoRef}>
          <button
            onClick={() => setDemoMenuOpen(!demoMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Run Demo Workflow</span>
            <span className="sm:hidden">Run Demo</span>
            <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
          </button>

          {demoMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-left">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Interactive Demonstrations
              </div>
              <button
                onClick={() => {
                  setDemoMenuOpen(false);
                  runDemoWorkflow('SUCCESS');
                }}
                className="w-full px-3 py-2 text-left hover:bg-blue-50/70 transition-colors flex items-start gap-2.5"
              >
                <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">Complete Successful Order Saga</div>
                  <div className="text-[11px] text-slate-500">
                    OrderPlaced → InventoryReserved → Payment → Confirmed → Notification
                  </div>
                </div>
              </button>
              <button
                onClick={() => {
                  setDemoMenuOpen(false);
                  runDemoWorkflow('PAYMENT_FAILURE');
                }}
                className="w-full px-3 py-2 text-left hover:bg-amber-50/70 transition-colors flex items-start gap-2.5"
              >
                <div className="w-6 h-6 rounded bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">Controlled Failure Simulation</div>
                  <div className="text-[11px] text-slate-500">
                    Triggers PaymentFailed event, alert logs, and test retry workflow
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">Notifications</span>
                  {unreadNotifs.length > 0 && (
                    <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                      {unreadNotifs.length} new
                    </span>
                  )}
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-blue-600 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.slice(0, 5).map(item => (
                  <div
                    key={item.id}
                    onClick={() => markNotificationRead(item.id)}
                    className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition-colors ${
                      !item.read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-slate-900">{item.title}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {item.timestamp.split(' ')[1] || item.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{item.message}</p>
                  </div>
                ))}
              </div>

              <div className="p-2 bg-slate-50 border-t border-slate-200 text-center">
                <button
                  onClick={() => {
                    setNotifOpen(false);
                    setCurrentPage('notifications');
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                >
                  <span>View All Notifications</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Administrator Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold ring-1 ring-slate-300">
            AM
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-tight">Alex Mercer</div>
            <div className="text-[10px] text-slate-500 font-medium">Enterprise Architect</div>
          </div>
        </div>
      </div>
    </header>
  );
};
