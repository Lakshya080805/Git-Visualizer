



// import React from 'react';
// import { branchColors, activityColors } from '../utils/colors';

// export default function CommitDetailsPanel({ commit, linkedPRs = [], linkedIssues = [], onClose, prStatusFilter, setPrStatusFilter }) {
//   // Filter PRs based on selected PR status filter
//   const filteredPRs = prStatusFilter === "all"
//     ? linkedPRs
//     : linkedPRs.filter(pr => {
//         if (prStatusFilter === "merged")
//           return pr.state === "closed" && pr.merged_at != null;
//         if (prStatusFilter === "closed")
//           return pr.state === "closed" && !pr.merged_at;
//         return pr.state === prStatusFilter;
//       });

//   return (
//     <div
//       className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg border-l border-gray-200 z-50 
//       transform transition-transform duration-300
//       ${commit ? 'translate-x-0' : 'translate-x-full'}`}
//     >
//       <div className="p-4 flex justify-between items-center border-b border-gray-200">
//         <h2 className="text-xl font-bold">Commit Details</h2>
//         <button
//           onClick={onClose}
//           className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
//         >
//           ×
//         </button>
//       </div>

//       {commit && (
//         <div className="p-6 space-y-4">
//           {/* Existing Commit Info */}
//           <div>
//             <p className="text-gray-500 text-sm">Hash</p>
//             <p className="font-mono break-all">{commit.hash}</p>
//           </div>
//           <div>
//             <p className="text-gray-500 text-sm">Message</p>
//             <p className="font-semibold">{commit.message}</p>
//           </div>
//           <div>
//             <p className="text-gray-500 text-sm">Author</p>
//             <p>{commit.author}</p>
//           </div>
//           <div>
//             <p className="text-gray-500 text-sm">Date</p>
//             <p>{commit.date}</p>
//           </div>
//           <div>
//             <p className="text-gray-500 text-sm">Branch</p>
//             <span
//               className="text-white text-sm font-medium px-3 py-1 rounded-full"
//               style={{ backgroundColor: branchColors[commit.branch] }}
//             >
//               {commit.branch}
//             </span>
//           </div>
//           <div>
//             <p className="text-gray-500 text-sm">Activity</p>
//             <span
//               className="text-white text-sm font-medium px-3 py-1 rounded-full"
//               style={{ backgroundColor: activityColors[commit.activity] }}
//             >
//               {commit.activity}
//             </span>
//           </div>
//           {commit.parent && (
//             <div>
//               <p className="text-gray-500 text-sm">Parent Commit</p>
//               <p className="font-mono">{commit.parent}</p>
//             </div>
//           )}

//           {/* PR Status Filter Dropdown */}
//           <div className="mt-6">
//             <label htmlFor="pr-status-filter" className="block mb-1 font-semibold">
//               Filter Pull Requests by Status
//             </label>
//             <select
//               id="pr-status-filter"
//               value={prStatusFilter}
//               onChange={(e) => setPrStatusFilter(e.target.value)}
//               className="w-full p-2 border rounded"
//             >
//               <option value="all">All</option>
//               <option value="open">Open</option>
//               <option value="merged">Merged</option>
//               <option value="closed">Closed</option>
//             </select>
//           </div>

//           {/* Linked Pull Requests */}
//           <div>
//             <p className="text-gray-500 text-base font-bold mt-6 mb-2">Linked Pull Requests</p>
//             {filteredPRs.length === 0 ? (
//               <p className="text-gray-400 text-sm">No linked pull requests</p>
//             ) : (
//               <ul className="space-y-2">
//                 {filteredPRs.map((pr) => (
//                   <li key={pr.number} className="border-b pb-1">
//                     <a
//                       href={pr.html_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 underline font-semibold"
//                     >
//                       #{pr.number}: {pr.title}
//                     </a>
//                     <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${pr.state === "open" ? "bg-green-100 text-green-700" : pr.merged_at ? "bg-purple-100 text-purple-600" : "bg-gray-300 text-gray-600"}`}>
//                       {pr.state === "closed" && pr.merged_at ? "Merged" : pr.state.charAt(0).toUpperCase() + pr.state.slice(1)}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Linked Issues */}
//           <div>
//             <p className="text-gray-500 text-base font-bold mt-6 mb-2">Linked Issues</p>
//             {linkedIssues.length === 0 ? (
//               <p className="text-gray-400 text-sm">No linked issues</p>
//             ) : (
//               <ul className="space-y-2">
//                 {linkedIssues.map((issue) => (
//                   <li key={issue.number} className="border-b pb-1">
//                     <a
//                       href={issue.html_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 underline font-semibold"
//                     >
//                       #{issue.number}: {issue.title}
//                     </a>
//                     <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${issue.state === "open" ? "bg-green-100 text-green-700" : "bg-gray-300 text-gray-600"}`}>
//                       {issue.state.charAt(0).toUpperCase() + issue.state.slice(1)}
//                     </span>
//                     {issue.labels && issue.labels.length > 0 && (
//                       <span className="ml-2">
//                         {issue.labels.map(label => (
//                           <span
//                             key={label.id || label.name}
//                             style={{ background: `#${label.color}`, color: 'white', borderRadius: '3px', padding: '2px 6px', marginRight: '4px', fontSize: '10px', fontWeight: 'bold' }}
//                           >
//                             {label.name}
//                           </span>
//                         ))}
//                       </span>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React from 'react';
import { branchColors, activityColors } from '../utils/colors';

export default function CommitDetailsPanel({
  commit,
  linkedPRs = [],
  linkedIssues = [],
  onClose,
  prStatusFilter,
  setPrStatusFilter,
}) {
  // Filter PRs based on selected PR status filter
  const filteredPRs =
    prStatusFilter === "all"
      ? linkedPRs
      : linkedPRs.filter(pr => {
        if (prStatusFilter === "merged")
          return pr.state === "closed" && pr.merged_at != null;
        if (prStatusFilter === "closed")
          return pr.state === "closed" && !pr.merged_at;
        return pr.state === prStatusFilter;
      });

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg border-l border-gray-200 z-50
      transform transition-transform duration-300
      ${commit ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-xl font-bold">Commit Details</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Scrollable Content */}
      {commit && (
        <div
          className="p-6 space-y-4 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 64px)" }} // 64px for header
        >
          {/* Commit Info */}
          <div>
            <p className="text-gray-500 text-sm">Hash</p>
            <p className="font-mono break-all">{commit.hash}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Message</p>
            <p className="font-semibold">{commit.message}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Author</p>
            <p>{commit.author}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Date</p>
            <p>{commit.date}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Branch</p>
            <span
              className="text-white text-sm font-medium px-3 py-1 rounded-full"
              style={{ backgroundColor: branchColors[commit.branch] }}
            >
              {commit.branch}
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Activity</p>
            <span
              className="text-white text-sm font-medium px-3 py-1 rounded-full"
              style={{ backgroundColor: activityColors[commit.activity] }}
            >
              {commit.activity}
            </span>
          </div>
          {commit.parent && (
            <div>
              <p className="text-gray-500 text-sm">Parent Commit</p>
              <p className="font-mono">{commit.parent}</p>
            </div>
          )}

          {/* PR Status Filter Dropdown */}
          <div className="mt-6">
            <label htmlFor="pr-status-filter" className="block mb-1 font-semibold">
              Filter Pull Requests by Status
            </label>
            <select
              id="pr-status-filter"
              value={prStatusFilter}
              onChange={(e) => setPrStatusFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="merged">Merged</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Linked Pull Requests */}
          <div>
            <p className="text-gray-500 text-base font-bold mt-6 mb-2">Linked Pull Requests</p>
            {filteredPRs.length === 0 ? (
              <p className="text-gray-400 text-sm">No linked pull requests</p>
            ) : (
              <ul className="space-y-2">
                {filteredPRs.map((pr) => (
                  <li key={pr.number} className="border-b pb-1">
                    <a
                      href={pr.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline font-semibold"
                    >
                      #{pr.number}: {pr.title}
                    </a>
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${pr.state === "open" ? "bg-green-100 text-green-700" : pr.merged_at ? "bg-purple-100 text-purple-600" : "bg-gray-300 text-gray-600"}`}>
                      {pr.state === "closed" && pr.merged_at ? "Merged" : pr.state.charAt(0).toUpperCase() + pr.state.slice(1)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Linked Issues */}
          <div>
            <p className="text-gray-500 text-base font-bold mt-6 mb-2">Linked Issues</p>
            {linkedIssues.length === 0 ? (
              <p className="text-gray-400 text-sm">No linked issues</p>
            ) : (
              <ul className="space-y-2">
                {linkedIssues.map((issue) => (
                  <li key={issue.number} className="border-b pb-1">
                    <a
                      href={issue.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline font-semibold"
                    >
                      #{issue.number}: {issue.title}
                    </a>
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${issue.state === "open" ? "bg-green-100 text-green-700" : "bg-gray-300 text-gray-600"}`}>
                      {issue.state.charAt(0).toUpperCase() + issue.state.slice(1)}
                    </span>
                    {issue.labels && issue.labels.length > 0 && (
                      <span className="ml-2">
                        {issue.labels.map(label => (
                          <span
                            key={label.id || label.name}
                            style={{
                              background: `#${label.color}`,
                              color: 'white',
                              borderRadius: '3px',
                              padding: '2px 6px',
                              marginRight: '4px',
                              fontSize: '10px',
                              fontWeight: 'bold',
                            }}
                          >
                            {label.name}
                          </span>
                        ))}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

