import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SystemLog, LogLevel } from '../types';
import {
  Terminal,
  Search,
  Filter,
  Trash2,
  Download,
  AlertCircle,
  Info,
  AlertTriangle,
  Bug,
  Copy,
  Check,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export const LogsPage: React.FC = () => {
  const { logs, microservices } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const serviceNames = useMemo(() => {
    return Array.from(new Set(logs.map(l => l.serviceName)));
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch =
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.correlationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
      const matchesService = serviceFilter === 'ALL' || log.serviceName === serviceFilter;

      return matchesSearch && matchesLevel && matchesService;
    });
  }, [logs, searchTerm, levelFilter, serviceFilter]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportLogsAsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `eventflow-logs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getLevelBadge = (level: LogLevel) => {
    switch (level) {
      case 'ERROR':
        return (
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
            ERROR
          </span>
        );
      case 'WARN':
        return (
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
            WARN
          </span>
        );
      case 'INFO':
        return (
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
            INFO
          </span>
        );
      case 'DEBUG':
        return (
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            DEBUG
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-600" />
            <span>Distributed System Logs & Distributed Tracing</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured logs correlated across microservices via Zipkin trace propagation
          </p>
        </div>

        <button
          onClick={exportLogsAsJson}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Logs JSON</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search message, correlation ID, or trace token..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 shrink-0">Level:</label>
            <select
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden"
            >
              <option value="ALL">All Levels</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
              <option value="DEBUG">DEBUG</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 shrink-0">Service:</label>
            <select
              value={serviceFilter}
              onChange={e => setServiceFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden"
            >
              <option value="ALL">All Services</option>
              {serviceNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Log Feed Console */}
      <div className="bg-slate-950 text-slate-200 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
        {/* Console Header Bar */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-400 ml-2">stdout / trace-logger.log</span>
          </div>
          <span className="text-slate-400">{filteredLogs.length} entries matching</span>
        </div>

        {/* Console Output */}
        <div className="divide-y divide-slate-900 max-h-[600px] overflow-y-auto font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No logs found matching current filters.
            </div>
          ) : (
            filteredLogs.map(log => {
              const isExpanded = expandedLogId === log.id;
              const hasMetadata = log.metadata && Object.keys(log.metadata).length > 0;

              return (
                <div
                  key={log.id}
                  className={`hover:bg-slate-900/60 transition-colors p-3 ${
                    log.level === 'ERROR'
                      ? 'bg-rose-950/20'
                      : log.level === 'WARN'
                      ? 'bg-amber-950/20'
                      : ''
                  }`}
                >
                  <div
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      {hasMetadata ? (
                        isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        )
                      ) : (
                        <div className="w-3.5" />
                      )}
                      <span className="text-slate-400">{log.timestamp}</span>
                      {getLevelBadge(log.level)}
                    </div>

                    <div className="text-blue-400 shrink-0 font-semibold">
                      [{log.serviceName}]
                    </div>

                    <div className="flex-1 text-slate-100 truncate" title={log.message}>
                      {log.message}
                    </div>

                    <div className="text-[11px] text-slate-400 shrink-0 font-mono">
                      {log.correlationId}
                    </div>
                  </div>

                  {/* Expanded metadata drawer */}
                  {isExpanded && (
                    <div className="mt-3 ml-7 p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 uppercase font-bold">
                          Detailed Structured Payload
                        </span>
                        <button
                          onClick={() => handleCopy(log.id, JSON.stringify(log, null, 2))}
                          className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300"
                        >
                          {copiedId === log.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === log.id ? 'Copied' : 'Copy Log Record'}</span>
                        </button>
                      </div>
                      <pre className="text-[11px] text-emerald-400 overflow-x-auto">
                        {JSON.stringify(
                          {
                            logId: log.id,
                            timestamp: log.timestamp,
                            level: log.level,
                            service: log.serviceName,
                            message: log.message,
                            correlationId: log.correlationId,
                            metadata: log.metadata || {}
                          },
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
