import React, { useState } from 'react';
import { KafkaEvent } from '../../types';
import { X, Copy, Check, Radio, Layers, Database } from 'lucide-react';

interface EventDetailsModalProps {
  event: KafkaEvent | null;
  onClose: () => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!event) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(event.payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{event.eventName}</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700">
                  {event.topic}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Event ID: {event.eventId} · Correlation: {event.correlationId}
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

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Kafka Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Producer
              </span>
              <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">
                {event.producerService}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Target Consumer
              </span>
              <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">
                {event.consumerService}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Partition / Offset
              </span>
              <span className="text-xs font-mono font-bold text-slate-800 block mt-0.5">
                P-{event.partition} : #{event.offset}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Event Status
              </span>
              <span
                className={`text-xs font-bold block mt-0.5 ${
                  event.status === 'PROCESSED'
                    ? 'text-emerald-600'
                    : event.status === 'PUBLISHED'
                    ? 'text-blue-600'
                    : 'text-rose-600'
                }`}
              >
                {event.status}
              </span>
            </div>
          </div>

          {/* Formatted JSON Payload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span>Message Payload (AVRO / JSON Schema)</span>
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            <div className="bg-slate-950 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-72 border border-slate-800">
              <pre>{JSON.stringify(event.payload, null, 2)}</pre>
            </div>
          </div>

          {/* SAGA Correlation Note */}
          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200/60 text-xs text-slate-600 leading-relaxed flex items-start gap-2">
            <Layers className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Distributed SAGA Context:</strong> This event carries
              correlation ID <code className="font-mono text-blue-700 bg-blue-100/60 px-1 py-0.5 rounded">{event.correlationId}</code> across
              asynchronous boundaries. Microservices filter and correlate downstream compensation transactions using this token.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Timestamp: <strong className="text-slate-700 font-mono">{event.timestamp}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
