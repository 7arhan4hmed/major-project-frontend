import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  ArrowRight,
  Server,
  Zap,
  ShoppingCart,
  Boxes,
  CreditCard,
  Bell
} from 'lucide-react';

export const WorkflowRunnerModal: React.FC = () => {
  const { workflowState, closeWorkflowModal, setCurrentPage } = useApp();

  if (!workflowState.isActive) return null;

  const steps = [
    {
      id: 1,
      title: 'Order Placement',
      service: 'Order Service',
      topic: 'order.events',
      event: 'OrderPlaced',
      icon: ShoppingCart
    },
    {
      id: 2,
      title: 'Stock Allocation',
      service: 'Inventory Service',
      topic: 'inventory.events',
      event: 'InventoryReserved',
      icon: Boxes
    },
    {
      id: 3,
      title: 'Payment Authorization',
      service: 'Payment Service',
      topic: 'payment.events',
      event: workflowState.scenario === 'SUCCESS' ? 'PaymentCompleted' : 'PaymentFailed',
      icon: CreditCard
    },
    {
      id: 4,
      title: 'Order Status Update',
      service: 'Order Service',
      topic: 'order.events',
      event: 'OrderConfirmed',
      icon: Zap
    },
    {
      id: 5,
      title: 'Customer Notification',
      service: 'Notification Service',
      topic: 'notification.events',
      event: 'NotificationSent',
      icon: Bell
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Event-Driven Workflow Simulation</h3>
                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {workflowState.scenario === 'SUCCESS' ? 'HAPPY PATH' : 'CONTROLLED FAILURE'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulated Kafka choreography across 5 decoupled microservices
              </p>
            </div>
          </div>
          <button
            onClick={closeWorkflowModal}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status banner */}
          <div
            className={`p-3.5 rounded-xl border mb-6 text-sm flex items-start gap-3 ${
              workflowState.status === 'RUNNING'
                ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                : workflowState.status === 'SUCCESS'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            {workflowState.status === 'RUNNING' ? (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0 mt-0.5" />
            ) : workflowState.status === 'SUCCESS' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-semibold text-xs tracking-wide uppercase text-slate-500">
                {workflowState.status === 'RUNNING' ? 'Workflow in progress' : 'Simulation State'}
              </div>
              <p className="font-medium text-sm mt-0.5">{workflowState.currentAction}</p>
            </div>
          </div>

          {/* Workflow Step Tracker */}
          <div className="space-y-3 mb-6">
            {steps.map(step => {
              const Icon = step.icon;
              let state: 'completed' | 'active' | 'pending' | 'failed' = 'pending';

              if (workflowState.status === 'RUNNING') {
                if (step.id < workflowState.step) state = 'completed';
                else if (step.id === workflowState.step) state = 'active';
                else state = 'pending';
              } else if (workflowState.status === 'SUCCESS') {
                state = 'completed';
              } else if (workflowState.status === 'FAILED') {
                if (step.id < 3) state = 'completed';
                else if (step.id === 3) state = 'failed';
                else state = 'pending';
              }

              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    state === 'active'
                      ? 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-300'
                      : state === 'completed'
                      ? 'bg-slate-50/80 border-slate-200'
                      : state === 'failed'
                      ? 'bg-rose-50/70 border-rose-300'
                      : 'bg-white border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        state === 'completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : state === 'active'
                          ? 'bg-blue-600 text-white'
                          : state === 'failed'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{step.title}</span>
                        <span className="text-[11px] font-mono text-slate-500">({step.service})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-blue-600">{step.topic}</span>
                        <span>·</span>
                        <span className="font-semibold text-slate-700">{step.event}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {state === 'completed' && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    )}
                    {state === 'active' && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing</span>
                      </span>
                    )}
                    {state === 'failed' && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Failed (Expected)</span>
                      </span>
                    )}
                    {state === 'pending' && (
                      <span className="text-xs text-slate-400 font-medium">Queued</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Console / Event Audit Stream */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Choreography Execution Log
            </div>
            <div className="bg-slate-950 text-slate-200 rounded-xl p-3.5 font-mono text-xs max-h-36 overflow-y-auto space-y-1">
              {workflowState.logs.map((line, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span className="text-blue-400">{line.slice(0, 9)}</span>
                  <span className="text-slate-300">{line.slice(9)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {workflowState.orderId ? (
              <span>Order Reference: <strong className="font-mono text-slate-800">{workflowState.orderId}</strong></span>
            ) : (
              <span>Simulated Kafka Producer / Consumer orchestration</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                closeWorkflowModal();
                setCurrentPage('kafka');
              }}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
            >
              Inspect Kafka Stream
            </button>
            <button
              onClick={() => {
                closeWorkflowModal();
                setCurrentPage('orders');
              }}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>View Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
