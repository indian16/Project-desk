// import React, { useState } from "react";
// import CardSettingsPanel from "./CardSettingsPanel";
// import { Settings, Plus } from "lucide-react";

// const DashboardCards = ({
//   cards,
//   metrics,
//   dynamicMetrics,
//   metricOptions,
//   filterOptions,
//   filters,
//   setFilters,
//   addCard,
//   handleUpdateCard,
//   handleDeleteCard,
//   cardRefs,
// }) => {
//   const [expandedCardId, setExpandedCardId] = useState(null);

//   return (
//     <section className="space-y-4">
//       <div className="flex items-center justify-between px-1">
//         <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
//           Cards Section
//         </h3>

//         <button
//           onClick={addCard}
//           className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-100"
//         >
//           <Plus size={14} />
//           Add Card
//         </button>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//         {cards.map((card) => {
//           let displayValue = 0;

//           if (metrics.hasOwnProperty(card.metric)) {
//             displayValue = metrics[card.metric];
//           } else {
//             const dynamic = dynamicMetrics.find((m) => m._id === card.metric);
//             displayValue = dynamic?.uploadedCount ?? 0;
//           }

//           const metricTitle =
//             metricOptions.find((m) => m.key === card.metric)?.label ||
//             dynamicMetrics.find((m) => m._id === card.metric)?.title ||
//             "Metric";

//           return (
//             <div
//               key={card.id}
//               ref={cardRefs?.current?.[card.id]}
//               className={`relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transition-all duration-300
//               ${expandedCardId === card.id ? "ring-2 ring-indigo-500 h-80" : "hover:border-slate-300"}
//               ${
//                 !expandedCardId &&
//                 (card.size === "S"
//                   ? "h-36"
//                   : card.size === "M"
//                     ? "h-44"
//                     : "h-52")
//               }
//               `}
//             >
//               {/* Settings Button */}

//               <button
//                 className="absolute top-4 right-4 p-1.5 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-md transition-colors"
//                 onClick={() =>
//                   setExpandedCardId(expandedCardId === card.id ? null : card.id)
//                 }
//               >
//                 <Settings size={18} />
//               </button>

//               {/* Title */}

//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
//                 {metricTitle}
//               </p>

//               {/* Number */}

//               <div className="flex flex-1 items-center justify-center">
//                 <p className="text-5xl font-black text-black-900 tracking-tight">
//                   {displayValue}
//                 </p>
//               </div>

//               {/* Settings Panel */}

//               {expandedCardId === card.id && (
//                 <div className="mt-4 pt-4 border-t border-slate-100 overflow-y-auto h-[calc(100%-80px)]">
//                   <CardSettingsPanel
//                     card={card}
//                     metricOptions={metricOptions}
//                     dynamicMetrics={dynamicMetrics}
//                     filters={filters}
//                     setFilters={setFilters}
//                     filterOptions={filterOptions}
//                     onClose={() => setExpandedCardId(null)}
//                     onSave={handleUpdateCard}
//                     onDelete={handleDeleteCard}
//                   />
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// };

// export default DashboardCards;
