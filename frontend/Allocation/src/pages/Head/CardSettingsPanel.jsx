import React, { useState } from "react";
import { Filter, Trash2 } from "lucide-react";
const CardSettingsPanel = ({
  card,
  metricOptions,
  dynamicMetrics = [],
  filters,
  setFilters,
  filterOptions,
  onClose,
  onSave,
  onDelete,
}) => {
  const [tempCard, setTempCard] = useState({ ...card });
  const [showFilters, setShowFilters] = useState(false);
  const selectStyle =
    "w-full p-3 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer text-slate-700 font-medium shadow-sm hover:border-slate-300";

  const allMetrics = [
    ...metricOptions,
    ...dynamicMetrics.map((m) => ({ key: m._id, label: m.title })),
  ];

  return (
    <div className="absolute inset-0 bg-white flex flex-col animate-in slide-in-from-top-2 duration-300 rounded-2xl ">
      {/* HEADER - Stays fixed */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h3 className="font-bold text-[10px] uppercase tracking-widest text-indigo-600">
          Card Settings
        </h3>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
            showFilters
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          <Filter size={12} />
          {showFilters ? ".." : "."}
        </button>
      </div>

      {/* BODY - This part scrolls */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
              Card Size
            </label>
            <select
              className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
              value={tempCard.size}
              onChange={(e) =>
                setTempCard({ ...tempCard, size: e.target.value })
              }
            >
              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
              Active Metric
            </label>
            <select
              className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
              value={tempCard.metric}
              onChange={(e) =>
                setTempCard({ ...tempCard, metric: e.target.value })
              }
            >
              {allMetrics.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="space-y-3 pt-4 border-t border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Filter
              </span>
              <button
                onClick={() =>
                  setFilters({ branch: "", section: "", group: "" })
                }
                className="text-[9px] font-bold text-indigo-500 hover:underline"
              >
                RESET
              </button>
            </div>

            <select
              className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-lg"
              value={filters.branch}
              onChange={(e) =>
                setFilters({ branch: e.target.value, section: "", group: "" })
              }
            >
              <option value="">All Branches</option>
              {filterOptions.branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-lg disabled:opacity-50"
              value={filters.section}
              disabled={!filters.branch}
              onChange={(e) =>
                setFilters({ ...filters, section: e.target.value, group: "" })
              }
            >
              <option value="">All Sections</option>
              {filterOptions.sections.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-lg disabled:opacity-50"
              value={filters.group}
              disabled={!filters.branch || !filters.section}
              onChange={(e) =>
                setFilters({ ...filters, group: e.target.value })
              }
            >
              <option value="">All Groups</option>
              {filterOptions.groups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* FOOTER - Stays fixed */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between rounded-b-2xl">
        <button
          onClick={() => onDelete(tempCard.id)}
          className="flex items-center gap-1 text-[10px] font-bold text-red-400 hover:text-red-600 transition"
        >
          <Trash2 size={14} /> DELETE
        </button>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600"
          >
            CANCEL
          </button>
          <button
            onClick={() => onSave(tempCard)}
            className="px-5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-md active:scale-95 transition-all"
          >
            APPLY
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default CardSettingsPanel;