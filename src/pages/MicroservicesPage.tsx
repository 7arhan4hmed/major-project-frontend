import React from 'react';
import { useApp } from '../context/AppContext';
import { Microservice, ServiceHealthStatus } from '../types';
import {
  Server,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ShieldCheck,
  Zap,
  Database,
  Cpu,
  Clock,
  ArrowRight,
  Info
} from 'lucide-react';

export const MicroservicesPage: React.FC = () => {
  const { microservices, toggleServiceFailure, restoreAllServices } = useApp();

  const totalServices = microservices.length;
  const healthyCount = microservices.filter(s => s.status === 'HEALTHY').length;
  const degradedCount = microservices.filter(s => s.status === 'DEGRADED').length;
  const downCount = microservices.filter(s => s.status === 'DOWN').length;

  const getStatusBadge = (status: ServiceHealthStatus) => {
    switch (status) {
      case 'HEALTHY':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Healthy</span>
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Degraded</span>
          </span>
        );
      case 'DOWN':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Service Down</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Disclaimer */}
      <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-950 leading-relaxed">
            <strong>Simulated Microservices Infrastructure:</strong> Health metrics, heartbeat latency, and failure injection scenarios model containerized services managed with Docker and Kubernetes. Real systems would run Spring Boot Actuator with Prometheus and Grafana.
          </div>
        </div>

        {downCount > 0 && (
          <button
            onClick={restoreAllServices}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore All Services</span>
          </button>
        )}
      </div>

      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            <span>Microservices Health & Resilience Console</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Distributed runtime monitoring, latency benchmarks & chaos engineering controls
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-600 font-bold">{healthyCount} Healthy</span>
            <span>·</span>
            <span className="text-rose-600 font-bold">{downCount} Down</span>
          </div>
        </div>
      </div>

      {/* Down Warning Alert */}
      {downCount > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl flex items-center justify-between text-xs text-rose-900">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <strong>Circuit Breaker Tripped:</strong> {downCount} service node{downCount > 1 ? 's are' : ' is'} currently offline. Kafka consumers are queuing messages until heartbeat restore.
            </div>
          </div>
          <button
            onClick={restoreAllServices}
            className="text-xs font-bold text-rose-800 underline hover:text-rose-950 shrink-0"
          >
            Heal Services
          </button>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {microservices.map(service => {
          const isDown = service.status === 'DOWN';

          return (
            <div
              key={service.id}
              className={`bg-white rounded-xl p-5 border transition-all shadow-xs flex flex-col justify-between ${
                isDown
                  ? 'border-rose-300 ring-2 ring-rose-200 bg-rose-50/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isDown
                          ? 'bg-rose-100 text-rose-700'
                          : service.type === 'BROKER'
                          ? 'bg-amber-100 text-amber-700'
                          : service.type === 'DATABASE'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {service.type === 'BROKER' ? (
                        <Zap className="w-4 h-4" />
                      ) : service.type === 'DATABASE' ? (
                        <Database className="w-4 h-4" />
                      ) : (
                        <Server className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{service.name}</h3>
                      <div className="text-[11px] font-mono text-slate-400">
                        Port: {service.port} · {service.version}
                      </div>
                    </div>
                  </div>

                  <div>{getStatusBadge(service.status)}</div>
                </div>

                <p className="text-xs text-slate-600 mt-2 mb-4 leading-relaxed line-clamp-2">
                  {service.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Latency
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {isDown ? 'TIMEOUT' : `${service.responseTimeMs} ms`}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Total Requests
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {service.requestCount.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Error Rate
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        isDown ? 'text-rose-600' : 'text-slate-800'
                      }`}
                    >
                      {service.errorRatePercent.toFixed(2)}%
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Uptime
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {service.uptimePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Dependencies */}
                {service.dependencies.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                      Downstream Dependencies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {service.dependencies.map(dep => (
                        <span
                          key={dep}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200"
                        >
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Chaos Engineering Toggle Button */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  Checked: {service.lastHealthCheck}
                </span>

                <button
                  onClick={() => toggleServiceFailure(service.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isDown
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{isDown ? 'Restore Service' : 'Simulate Failure'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
