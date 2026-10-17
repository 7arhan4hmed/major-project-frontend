import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { KafkaEvent, KafkaTopic } from '../types';
import {
  Zap,
  Radio,
  Pause,
  Play,
  Search,
  Filter,
  Eye,
  Layers,
  Database,
  ArrowRight,
  Server,
  Activity,
  CheckCircle2,
  AlertCircle,
  Copy,
  Info
} from 'lucide-react';
import { EventDetailsModal } from '../components/modals/EventDetailsModal';

export const KafkaStreamPage: React.FC = () => {
  const { kafkaEvents, isPausedFeed, setIsPausedFeed } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<KafkaEvent | null>(null);

  // Simulated metrics
  const totalPublished = kafkaEvents.length;
  const processedCount = kafkaEvents.filter(e => e.status === 'PROCESSED').length;
  const failedCount = kafkaEvents.filter(e => e.status === 'FAILED').length;
  const totalConsumed = totalPublished + 14;
  const simulatedLag = isPausedFeed ? 42 : 8;
  const simulatedEventsPerMin = isPausedFeed ? 0 : 138;

  // Topics configuration
  const topicsSummary = [
    {
      name: 'order.events' as KafkaTopic,
      partitions: 3,
      replicas: 3,
      isr: 3,
      description: 'Order lifecycle events (OrderPlaced, OrderConfirmed, OrderCancelled)',
      retentionHours: 168
    },
    {
      name: 'inventory.events' as KafkaTopic,
      partitions: 3,
      replicas: 3,
      isr: 3,
      description: 'Warehouse SKU allocations, reservation holds, and catalog updates',
      retentionHours: 168
    },
    {
      name: 'payment.events' as KafkaTopic,
      partitions: 3,
      replicas: 3,
      isr: 3,
      description: 'Transaction authorizations, settlement confirmations, and decline events',
      retentionHours: 720
    },
    {
      name: 'notification.events' as KafkaTopic,
      partitions: 2,
      replicas: 3,
      isr: 3,
      description: 'Customer notification triggers, SMTP worker payloads, and SMS webhooks',
      retentionHours: 72
    },
    {
      name: 'system.events' as KafkaTopic,
      partitions: 2,
      replicas: 3,
      isr: 3,
      description: 'Microservice health check alerts, circuit breaker states, and failover tokens',
      retentionHours: 360
    }
  ];

  const filteredEvents = useMemo(() => {
    return kafkaEvents.filter(evt => {
      const matchesSearch =
        evt.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.eventId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.producerService.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.correlationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(evt.payload).toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTopic = selectedTopic === 'ALL' || evt.topic === selectedTopic;

      return matchesSearch && matchesTopic;
    });
  }, [kafkaEvents, searchTerm, selectedTopic]);

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-950 leading-relaxed">
            <strong>Simulated Kafka Event Stream — Demo Mode:</strong> This console models real-time distributed stream processing on Apache Kafka (KRaft mode). Events shown demonstrate pub/sub decoupling across microservices, partition keys, offsets, and consumer group processing.
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={() => setIsPausedFeed(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
              isPausedFeed
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
            }`}
          >
            {isPausedFeed ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPausedFeed ? 'Resume Stream' : 'Pause Stream'}</span>
          </button>
        </div>
      </div>

      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <span>Apache Kafka Cluster Telemetry</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Event streaming pipeline: 3-Node Cluster (Broker IDs: 1, 2, 3) · KRaft Consensus Mode
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Broker Cluster Online</span>
          </div>
        </div>
      </div>

      {/* Stream Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Total Published
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {totalPublished}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Total topic records</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Consumed Records
          </div>
          <div className="text-xl font-bold font-mono text-blue-600 tabular-nums">
            {totalConsumed}
          </div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">Across 4 consumer groups</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Processed OK
          </div>
          <div className="text-xl font-bold font-mono text-emerald-600 tabular-nums">
            {processedCount}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Committed offsets</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Failed / DLQ
          </div>
          <div className="text-xl font-bold font-mono text-rose-600 tabular-nums">
            {failedCount}
          </div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">Dead Letter Queue: 0</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Consumer Lag
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {simulatedLag} <span className="text-xs text-slate-400 font-normal">msgs</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Max lag on order-group</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Throughput
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {simulatedEventsPerMin} <span className="text-xs text-slate-400 font-normal">msg/m</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Estimated velocity</div>
        </div>
      </div>

      {/* Visual Event-Flow Diagram */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Event Flow Topology (Producers → Kafka Broker → Consumers)</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Decoupled publish-subscribe message routing with partition key affinity
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">Cluster: kafka-kraft-prod-01</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50/70 rounded-xl border border-slate-200">
          {/* Producers Column */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200">
              <Server className="w-3.5 h-3.5 text-blue-600" />
              <span>Producer Services</span>
            </div>
            {[
              { name: 'Order Service', emits: 'OrderPlaced, OrderConfirmed' },
              { name: 'Inventory Service', emits: 'InventoryReserved, InventoryUpdated' },
              { name: 'Payment Service', emits: 'PaymentCompleted, PaymentFailed' }
            ].map((p, idx) => (
              <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <div className="text-xs font-bold text-slate-900">{p.name}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{p.emits}</div>
              </div>
            ))}
          </div>

          {/* Central Kafka Topics Column */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Kafka Topics (Partitioned)</span>
            </div>
            {[
              { topic: 'order.events', partitions: 3 },
              { topic: 'inventory.events', partitions: 3 },
              { topic: 'payment.events', partitions: 3 },
              { topic: 'notification.events', partitions: 2 }
            ].map((t, idx) => (
              <div key={idx} className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center justify-between shadow-2xs">
                <div className="font-mono text-xs font-bold text-blue-900">{t.topic}</div>
                <div className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                  {t.partitions} Partitions
                </div>
              </div>
            ))}
          </div>

          {/* Consumers Column */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Consumer Groups</span>
            </div>
            {[
              { name: 'Inventory Consumer Group', topic: 'order.events', lag: '0 msgs' },
              { name: 'Payment Consumer Group', topic: 'inventory.events', lag: '2 msgs' },
              { name: 'Notification Worker Pool', topic: 'payment.events, order.events', lag: '0 msgs' }
            ].map((c, idx) => (
              <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{c.name}</span>
                  <span className="text-[10px] font-mono text-emerald-600 font-semibold">{c.lag}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Listens: {c.topic}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topic Overview Cards */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Topic Configuration & Replica Topology
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {topicsSummary.map(t => {
            const count = kafkaEvents.filter(e => e.topic === t.name).length;
            return (
              <div key={t.name} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-blue-700">{t.name}</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-white rounded border border-slate-200 text-slate-700">
                    {count} events
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 mb-2">{t.description}</p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-200">
                  <span>Partitions: {t.partitions}</span>
                  <span>Replicas: {t.replicas}</span>
                  <span>ISR: {t.isr}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stream Filter & Live Feed Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 border-b border-slate-200 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search event name, ID, payload, or correlation..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto">
              <button
                onClick={() => setSelectedTopic('ALL')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedTopic === 'ALL'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Topics
              </button>
              {topicsSummary.map(t => (
                <button
                  key={t.name}
                  onClick={() => setSelectedTopic(t.name)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg font-mono transition-colors whitespace-nowrap ${
                    selectedTopic === t.name
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">Event ID</th>
                <th className="px-4 py-3">Event Name</th>
                <th className="px-4 py-3">Topic</th>
                <th className="px-4 py-3">Producer</th>
                <th className="px-4 py-3">Consumer</th>
                <th className="px-4 py-3 text-center">Partition : Offset</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3 text-right">Inspect Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.map(evt => (
                <tr key={evt.eventId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">
                    {evt.eventId}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    {evt.eventName}
                  </td>
                  <td className="px-4 py-3 font-mono text-blue-600 font-medium">
                    {evt.topic}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {evt.producerService}
                  </td>
                  <td className="px-4 py-3 text-slate-700 truncate max-w-[140px]" title={evt.consumerService}>
                    {evt.consumerService}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-[11px] text-slate-600">
                    P-{evt.partition} : #{evt.offset}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        evt.status === 'PROCESSED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : evt.status === 'PUBLISHED'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {evt.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                    {evt.timestamp}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedEvent(evt)}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>JSON</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredEvents.length} of {kafkaEvents.length} Kafka stream records</span>
          <span className="font-mono text-[11px]">Broker Port 9092 · Zero-Data-Loss In-Sync Replicas (min.insync.replicas=2)</span>
        </div>
      </div>

      <EventDetailsModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};
