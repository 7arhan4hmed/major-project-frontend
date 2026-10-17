import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { NotificationItem } from '../types';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  ShoppingCart,
  CreditCard,
  Boxes,
  Terminal,
  Check,
  Trash2,
  Filter
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications
  } = useApp();

  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchesType = typeFilter === 'ALL' || n.type === typeFilter;
      const matchesUnread = !unreadOnly || !n.read;
      return matchesType && matchesUnread;
    });
  }, [notifications, typeFilter, unreadOnly]);

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'ORDER':
        return <ShoppingCart className="w-4 h-4 text-blue-600" />;
      case 'PAYMENT':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'INVENTORY':
        return <Boxes className="w-4 h-4 text-amber-600" />;
      case 'ALERT':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      default:
        return <Terminal className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <span>Notification Service & Event Dispatch Center</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time transactional customer notifications, webhook alerts, and warehouse dispatches
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="flex items-center gap-1.5 px-3 py-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Alerts' },
            { id: 'ORDER', label: 'Orders' },
            { id: 'PAYMENT', label: 'Payments' },
            { id: 'INVENTORY', label: 'Inventory' },
            { id: 'ALERT', label: 'System Alerts' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                typeFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={e => setUnreadOnly(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
          />
          <span>Unread alerts only ({unreadCount})</span>
        </label>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-xs">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">No notifications found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Notifications will trigger automatically as orders progress through the Kafka event pipeline.
            </p>
          </div>
        ) : (
          filteredNotifications.map(item => (
            <div
              key={item.id}
              onClick={() => markNotificationRead(item.id)}
              className={`bg-white rounded-xl p-4 border transition-all cursor-pointer shadow-xs flex items-start justify-between gap-4 ${
                !item.read
                  ? 'border-blue-200 bg-blue-50/20 ring-1 ring-blue-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    item.type === 'ALERT'
                      ? 'bg-rose-100'
                      : item.type === 'INVENTORY'
                      ? 'bg-amber-100'
                      : item.type === 'PAYMENT'
                      ? 'bg-emerald-100'
                      : 'bg-blue-100'
                  }`}
                >
                  {getIcon(item.type)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>
                  {item.relatedEntityId && (
                    <div className="mt-2 text-[11px] font-mono text-blue-600">
                      Entity Reference: <strong>{item.relatedEntityId}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-[11px] font-mono text-slate-400">
                  {item.timestamp}
                </div>
                {!item.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationRead(item.id);
                    }}
                    className="text-[11px] text-blue-600 hover:underline font-semibold mt-1 inline-block"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
