import React from 'react';
import type { EventLogItem } from '../types/fakeshield';
import { Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface EventTimelineProps {
  events: EventLogItem[];
  onClearEvents?: () => void;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({ events, onClearEvents }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          Security Event Audit Timeline
        </h3>
        {onClearEvents && events.length > 0 && (
          <button
            onClick={onClearEvents}
            className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            Clear Log
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto max-h-56 sm:max-h-64 space-y-2 pr-1 custom-scrollbar">
        {events.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-mono">
            No risk state changes logged yet.
          </div>
        ) : (
          events.map((evt) => {
            let badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            let Icon = ShieldCheck;

            if (evt.riskLevel === 'HIGH') {
              badgeClass = 'bg-rose-500/15 text-rose-400 border-rose-500/40';
              Icon = AlertTriangle;
            } else if (evt.riskLevel === 'MEDIUM') {
              badgeClass = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
              Icon = AlertTriangle;
            }

            return (
              <div
                key={evt.id}
                className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between text-xs transition-colors hover:border-slate-700"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`p-1 rounded-md border ${badgeClass}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <div className="truncate">
                    <p className="font-medium text-slate-200 truncate">{evt.message}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Manipulation score: {(evt.score * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${badgeClass}`}>
                    {evt.riskLevel}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                    {evt.timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
