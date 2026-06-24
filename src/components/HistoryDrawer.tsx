import React from 'react';
import { X, History, Copy, Check, Clock, Cpu, FileText, Image as ImageIcon, Trash2 } from 'lucide-react';
import { PromptHistoryItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: PromptHistoryItem[];
  onClearHistory: () => void;
  onSelectHistory: (item: PromptHistoryItem) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSelectHistory
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (e: React.MouseEvent, prompt: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/80 backdrop-blur-md transition-opacity select-none">
      <div className="w-full max-w-xl bg-[#070a12] border-l border-[#1e293b] shadow-2xl flex flex-col h-full text-white">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#1e293b] flex items-center justify-between bg-[#0d1322]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#182238] border border-[#a8ff35]/30 flex items-center justify-center">
              <History className="w-4 h-4 text-[#a8ff35]" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-wide">Prompt Tracking History</h3>
              <p className="text-[10px] text-[#94a3b8] font-mono">Supabase PostgreSQL Log Cache</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-2 rounded-full text-[#94a3b8] hover:text-[#f43f5e] hover:bg-[#1e293b] transition-colors"
                title="Purge session records"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History Items Scroll List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center my-auto py-20 text-center text-[#94a3b8] gap-4">
              <div className="w-16 h-16 rounded-full bg-[#111726] border border-[#1e293b] flex items-center justify-center">
                <History className="w-8 h-8 opacity-30 text-[#a8ff35]" />
              </div>
              <p className="text-sm font-semibold">No reverse prompt engineering records benchmarked yet.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => { onSelectHistory(item); onClose(); }}
                className="bg-[#111726] border border-[#1e293b] hover:border-[#a8ff35]/60 rounded-2xl p-5 cursor-pointer flex flex-col gap-3.5 transition-all group shadow-lg"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-2 text-[#a8ff35] font-bold">
                    {item.inputType === 'image' ? <ImageIcon className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                    <span className="truncate max-w-[200px]">{item.inputSummary}</span>
                  </span>
                  <span className="text-[#94a3b8] flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {item.assetPreview && (
                  <div className="h-28 w-full rounded-xl overflow-hidden bg-[#070a12] border border-[#1e293b] flex items-center justify-center p-1">
                    <img src={item.assetPreview} alt="Ref" className="h-full object-contain rounded-lg" />
                  </div>
                )}

                <p className="text-xs font-mono text-white line-clamp-3 bg-[#070a12] p-3 rounded-xl border border-[#1e293b] select-text">
                  {item.prompt}
                </p>

                <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#1e293b]">
                  <span className="px-2.5 py-1 rounded-full bg-[#182238] border border-[#a8ff35]/30 text-[#a8ff35] font-black uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Cpu className="w-3 h-3" /> {item.engine}
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[#94a3b8] font-mono font-bold">{item.latencyMs}ms</span>
                    <button
                      onClick={(e) => handleCopy(e, item.prompt, item.id)}
                      className="px-3 py-1.5 rounded-full bg-[#a8ff35] hover:bg-[#bbf754] text-black font-black transition-colors flex items-center gap-1 text-xs uppercase"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5 stroke-[2.5]" />}
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#1e293b] bg-[#0d1322] text-center text-xs text-[#94a3b8] font-mono">
          Supabase PostgreSQL Storage Layer • Automatic Tier Quota Sync
        </div>
      </div>
    </div>
  );
};
