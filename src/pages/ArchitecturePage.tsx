import React, { useState } from 'react';
import {
  Network,
  Server,
  Zap,
  Database,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowDown,
  ArrowRight,
  GitBranch,
  CheckCircle2,
  Box,
  Activity,
  FileCode,
  Info
} from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'diagram' | 'concepts' | 'techstack'>('diagram');

  return (
    <div className="space-y-6">
      {/* Intended Architecture Disclaimer */}
      <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-950 leading-relaxed">
          <strong>System Design & Architecture Specification:</strong> This diagram models the target production microservices architecture designed for our college capstone project. The current React web application simulates this event choreography locally in the browser to enable comprehensive interactive evaluation by academic evaluators.
        </div>
      </div>

      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-600" />
            <span>Distributed System Architecture</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Microservices SAGA Choreography powered by Apache Kafka, Spring Boot & Docker
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'diagram' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Visual Topology
          </button>
          <button
            onClick={() => setActiveTab('concepts')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'concepts' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Why Event-Driven?
          </button>
          <button
            onClick={() => setActiveTab('techstack')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'techstack' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Technology Stack
          </button>
        </div>
      </div>

      {activeTab === 'diagram' && (
        <div className="space-y-6">
          {/* Main Visual Architecture Canvas */}
          <div className="bg-slate-950 text-slate-100 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl overflow-x-auto">
            <div className="min-w-[840px] space-y-8">
              {/* Level 1: Client Layer */}
              <div className="flex flex-col items-center">
                <div className="w-80 p-3.5 bg-slate-900 border border-slate-700 rounded-xl text-center shadow-lg">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-white mb-0.5">
                    <Box className="w-4 h-4 text-blue-400" />
                    <span>Single Page React Client (Vite + TS)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Port 3000 · JWT Bearer Tokens · Tailored UI
                  </div>
                </div>

                <div className="flex flex-col items-center my-1">
                  <div className="w-0.5 h-6 bg-blue-500/80" />
                  <ArrowDown className="w-4 h-4 text-blue-400 -mt-1" />
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    HTTPS / REST JSON
                  </span>
                </div>
              </div>

              {/* Level 2: API Gateway & Cross-Cutting Concerns */}
              <div className="flex items-center justify-center gap-6">
                {/* Circuit Breaker & Security Badge */}
                <div className="w-56 p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-left">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Resilience4j</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1">Circuit Breaker & Fallbacks</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Rate limiter: 100 req/sec</div>
                </div>

                {/* API Gateway */}
                <div className="w-80 p-4 bg-blue-950/60 border border-blue-500/50 rounded-xl text-center shadow-lg ring-1 ring-blue-500/30">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-white mb-0.5">
                    <Server className="w-4 h-4 text-blue-400" />
                    <span>Spring Cloud API Gateway (Port 8080)</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono">
                    Routing · JWT Authentication · SSL Termination
                  </div>
                </div>

                {/* Distributed Tracing */}
                <div className="w-56 p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-left">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Zipkin Tracing</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1">B3 Trace & Span Headers</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Latency profiler across hops</div>
                </div>
              </div>

              {/* Down Arrow to Ingress Microservices */}
              <div className="flex flex-col items-center my-1">
                <div className="w-0.5 h-6 bg-blue-500/80" />
                <ArrowDown className="w-4 h-4 text-blue-400 -mt-1" />
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Internal Service Mesh
                </span>
              </div>

              {/* Level 3: Order Service & User Service */}
              <div className="grid grid-cols-2 gap-8 max-w-3xl mx-auto">
                <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl shadow-lg">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <Server className="w-4 h-4 text-emerald-400" />
                      <span>Order Service (8082)</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                      Saga Initiator
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    Receives checkout requests, persists initial record, and publishes <code className="text-emerald-400 font-mono">OrderPlaced</code> to Kafka.
                  </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl shadow-lg">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <Server className="w-4 h-4 text-indigo-400" />
                      <span>User Service (8081)</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded">
                      RBAC / Auth
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    Manages customer accounts, tenant permissions, and shipping profile records.
                  </div>
                </div>
              </div>

              {/* Level 4: Apache Kafka Central Event Bus */}
              <div className="p-6 bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border-2 border-blue-500/60 rounded-2xl shadow-2xl relative">
                <div className="flex items-center justify-between pb-3 border-b border-blue-800/60 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                      <Zap className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Apache Kafka Event Broker Cluster</div>
                      <div className="text-[11px] font-mono text-blue-300">Port 9092 · KRaft Mode · Partitioned High-Throughput Backbone</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-800">
                    Asynchronous Event Stream
                  </span>
                </div>

                {/* Kafka Topics */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-blue-700/50">
                    <div className="font-mono text-xs font-bold text-blue-300 mb-1">order.events</div>
                    <div className="text-[10px] text-slate-400 leading-tight">
                      OrderPlaced, OrderConfirmed, OrderCancelled
                    </div>
                    <div className="text-[9px] font-mono text-slate-500 mt-2">Partitions: 3 · Rep: 3</div>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-xl border border-blue-700/50">
                    <div className="font-mono text-xs font-bold text-emerald-300 mb-1">inventory.events</div>
                    <div className="text-[10px] text-slate-400 leading-tight">
                      InventoryReserved, InventoryUpdated, OutOfStock
                    </div>
                    <div className="text-[9px] font-mono text-slate-500 mt-2">Partitions: 3 · Rep: 3</div>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-xl border border-blue-700/50">
                    <div className="font-mono text-xs font-bold text-amber-300 mb-1">payment.events</div>
                    <div className="text-[10px] text-slate-400 leading-tight">
                      PaymentInitiated, PaymentCompleted, PaymentFailed
                    </div>
                    <div className="text-[9px] font-mono text-slate-500 mt-2">Partitions: 3 · Rep: 3</div>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-xl border border-blue-700/50">
                    <div className="font-mono text-xs font-bold text-purple-300 mb-1">notification.events</div>
                    <div className="text-[10px] text-slate-400 leading-tight">
                      NotificationSent, WebhookDispatched
                    </div>
                    <div className="text-[9px] font-mono text-slate-500 mt-2">Partitions: 2 · Rep: 3</div>
                  </div>
                </div>
              </div>

              {/* Level 5: Consumer Microservices */}
              <div className="grid grid-cols-3 gap-5">
                <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <span>Inventory Service (8083)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed mb-2">
                    Consumes <code className="text-blue-300 font-mono">OrderPlaced</code>. Performs optimistic stock locks and publishes <code className="text-emerald-300 font-mono">InventoryReserved</code>.
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800">
                    Attached to MySQL Store
                  </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                    <Server className="w-4 h-4 text-amber-400" />
                    <span>Payment Service (8084)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed mb-2">
                    Consumes <code className="text-emerald-300 font-mono">InventoryReserved</code>. Charges card/PO with idempotency and publishes <code className="text-amber-300 font-mono">PaymentCompleted</code>.
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800">
                    Attached to MySQL Store
                  </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                    <Server className="w-4 h-4 text-purple-400" />
                    <span>Notification Service (8085)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed mb-2">
                    Consumes <code className="text-blue-300 font-mono">OrderConfirmed</code>. Dispatches asynchronous email receipts and internal Slack webhooks.
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800">
                    Attached to MongoDB Cluster
                  </div>
                </div>
              </div>

              {/* Level 6: Persistence Layer & Docker Isolation */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-around gap-4 text-center">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                  <Database className="w-4 h-4 text-blue-400" />
                  <span>MySQL (InnoDB): Orders, Products, Payments</span>
                </div>
                <div className="text-slate-600">|</div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>MongoDB: Logs, Audit Trails & Traces</span>
                </div>
                <div className="text-slate-600">|</div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                  <Box className="w-4 h-4 text-amber-400" />
                  <span>Docker Containers & Kubernetes Pods</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'concepts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1. Loose Coupling & Asynchronous Decoupling</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              In traditional monolithic architectures, Order processing involves sequential synchronous HTTP calls to Inventory, Payment, and Notification services. If the Notification service crashes or responds slowly, the entire checkout blocks or fails.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              With <strong>Apache Kafka</strong>, the Order Service only emits an <code className="font-mono text-blue-600 bg-slate-100 px-1 py-0.5 rounded">OrderPlaced</code> event and immediately returns an HTTP 202 to the customer. Downstream services consume the event at their own rate without blocking the checkout flow.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>2. SAGA Pattern (Choreography vs Orchestration)</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Since distributed microservices do not share a single relational database, traditional multi-table 2-Phase Commit (2PC) transactions do not scale.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              We implement the <strong>Saga Pattern with Event Choreography</strong>: each service executes a local transaction and publishes an event. Downstream services listen and trigger the next step. If a step fails (such as payment decline), compensating transactions revert previous state (releasing reserved stock).
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>3. Resiliency & Backpressure Management</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              During flash sales or high-traffic periods, synchronous REST services collapse under thread pool exhaustion. Apache Kafka functions as an elastic buffer (backpressure), queuing millions of messages reliably without dropping requests.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consumer groups scale horizontally by adding worker nodes mapped directly to topic partition counts.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>4. Auditability & Event Sourcing</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kafka partitions provide an immutable, append-only commit log. Every order modification, payment attempt, and stock reduction is recorded permanently with partition offsets.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              This enables time-travel debugging, zero-loss compliance audits, and real-time streaming analytics (e.g. Apache Flink or Kafka Streams).
            </p>
          </div>
        </div>
      )}

      {activeTab === 'techstack' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Technology Stack Matrix
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Tools, frameworks, and protocols powering the enterprise system
            </p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              { component: 'Apache Kafka 3.6', category: 'Event Broker', role: 'KRaft consensus cluster, topic partitions, producer/consumer group protocol' },
              { component: 'Spring Boot 3.2', category: 'Backend Microservices', role: 'Java/Kotlin REST APIs, Spring Cloud Gateway, Kafka Streams client' },
              { component: 'Resilience4j', category: 'Fault Tolerance', role: 'Circuit breakers, rate limiters, retry policies, fallback handlers' },
              { component: 'MySQL 8.0', category: 'Relational Store', role: 'ACID transactions for Order, Payment, and Catalog entities' },
              { component: 'MongoDB 7.0', category: 'Document Store', role: 'Unstructured event payload logs, notifications, and telemetry metrics' },
              { component: 'Zipkin & Micrometer', category: 'Observability', role: 'Distributed request tracing with correlation IDs propagated across Kafka headers' },
              { component: 'Docker & Kubernetes', category: 'Containerization', role: 'Container images, pod replicas, service mesh, health liveness probes' },
              { component: 'React 19 + TypeScript', category: 'Frontend Presentation', role: 'Enterprise operations dashboard with live simulated event choreography' }
            ].map((item, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/70">
                <div className="w-48 font-bold text-slate-900">{item.component}</div>
                <div className="w-40 font-mono text-[11px] text-blue-600">{item.category}</div>
                <div className="flex-1 text-slate-600">{item.role}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
