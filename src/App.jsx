// // // import React, { useState } from 'react';
// // // import { ReactFlowProvider } from 'reactflow';
// // // import BranchTree from './components/BranchTree';
// // // import CommitList from './components/CommitList';

// // // function App() {
// // //   const [hoveredCommit, setHoveredCommit] = useState(null);
// // //   const [searchTerm, setSearchTerm] = useState('');
// // //   const [selectedCommit, setSelectedCommit] = useState(null);

// // //   return (
// // //     <div className="flex">
// // //       {/* Sidebar */}
// // //       <div className="w-64 bg-gray-900 text-white p-4">
// // //         <h1 className="text-xl font-bold">Git Visualizer</h1>
// // //         <ul className="mt-4 space-y-2">
// // //           <li className="text-yellow-400">Branches</li>
// // //           <li>Commits</li>
// // //           <li>Settings</li>
// // //         </ul>
// // //       </div>

// // //       {/* Main Content */}
// // //       <div className="flex-1 p-8 bg-gray-100">
// // //         <h2 className="text-2xl font-bold mb-4">Commit Visualization</h2>

// // //         {/* 🔍 Search Bar */}
// // //         <input
// // //           type="text"
// // //           placeholder="Search commit by hash or message..."
// // //           value={searchTerm}
// // //           onChange={(e) => setSearchTerm(e.target.value)}
// // //           className="border p-2 rounded w-80 shadow-sm mb-4"
// // //         />

// // //         {/* ✅ Wrap with ReactFlowProvider */}
// // //         <ReactFlowProvider>
// // //           <BranchTree
// // //             selectedCommit={selectedCommit}
// // //             hoveredCommit={hoveredCommit}        // ✅ Pass hovered commit
// // //             searchTerm={searchTerm} 
// // //             onHover={setHoveredCommit}
// // //             onSelect={setSelectedCommit}
// // //           />
// // //           <CommitList
// // //             hoveredCommit={hoveredCommit}
// // //             searchTerm={searchTerm}
// // //             onClickCommit={setSelectedCommit}
// // //             onHoverCommit={setHoveredCommit}    // ✅ Sync hover to tree
// // //           />
// // //         </ReactFlowProvider>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default App;

// // //---------------------------------------------------------------------------------------

// // import React, { useState } from 'react';
// // import { ReactFlowProvider } from 'reactflow';
// // import BranchTree from './components/BranchTree';
// // import CommitList from './components/CommitList';
// // import { dummyCommits } from './data/dummyCommits';

// // function App() {
// //   const [hoveredCommit, setHoveredCommit] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [selectedCommit, setSelectedCommit] = useState(null);
// //   const [selectedBranch, setSelectedBranch] = useState('all'); // ✅ Branch filter

// //   // ✅ Get unique branches
// //   const branches = ['all', ...new Set(dummyCommits.map((c) => c.branch))];

// //   return (
// //     <div className="flex">
// //       {/* Sidebar */}
// //       <div className="w-64 bg-gray-900 text-white p-4">
// //         <h1 className="text-xl font-bold">Git Visualizer</h1>

// //         {/* ✅ Branch Filter Dropdown */}
// //         <label className="block mt-6 mb-2 text-sm">Filter by Branch:</label>
// //         <select
// //           className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
// //           value={selectedBranch}
// //           onChange={(e) => setSelectedBranch(e.target.value)}
// //         >
// //           {branches.map((b) => (
// //             <option key={b} value={b}>
// //               {b}
// //             </option>
// //           ))}
// //         </select>

// //         <ul className="mt-6 space-y-2">
// //           <li className="text-yellow-400">Branches</li>
// //           <li>Commits</li>
// //           <li>Settings</li>
// //         </ul>
// //       </div>

// //       {/* Main Content */}
// //       <div className="flex-1 p-8 bg-gray-100">
// //         <h2 className="text-2xl font-bold mb-4">Commit Visualization</h2>

// //         {/* 🔍 Search Bar */}
// //         <input
// //           type="text"
// //           placeholder="Search commit by hash or message..."
// //           value={searchTerm}
// //           onChange={(e) => setSearchTerm(e.target.value)}
// //           className="border p-2 rounded w-80 shadow-sm mb-4"
// //         />

// //         {/* ✅ Wrap with ReactFlowProvider */}
// //         <ReactFlowProvider>
// //           <BranchTree
// //             selectedCommit={selectedCommit}
// //             hoveredCommit={hoveredCommit}
// //             searchTerm={searchTerm}
// //             selectedBranch={selectedBranch}  // ✅ Branch filtering
// //             onHover={setHoveredCommit}
// //             onSelect={(id) => {
// //               setSelectedCommit(id);
// //               // ✅ Scroll CommitList to match on select
// //               const el = document.getElementById(`commit-${id}`);
// //               if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
// //             }}
// //           />
// //           <CommitList
// //             hoveredCommit={hoveredCommit}
// //             searchTerm={searchTerm}
// //             selectedBranch={selectedBranch}  // ✅ Filter commits in list
// //             onClickCommit={setSelectedCommit}
// //             onHoverCommit={setHoveredCommit} // ✅ Sync hover to tree
// //           />
// //         </ReactFlowProvider>
// //       </div>
// //     </div>
// //   );
// // }

// // export default App;
// //-----------------------------------------------------------------------------------------------------

// import React, { useState } from 'react';
// import { ReactFlowProvider } from 'reactflow';
// import BranchTree from './components/BranchTree';
// import CommitList from './components/CommitList';
// import CommitDetailsPanel from './components/CommitDetailsPanel'; // ✅ NEW
// import { dummyCommits } from './data/dummyCommits';

// function App() {
//   const [hoveredCommit, setHoveredCommit] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCommit, setSelectedCommit] = useState(null);
//   const [selectedBranch, setSelectedBranch] = useState('all');

//   const branches = ['all', ...new Set(dummyCommits.map((c) => c.branch))];

//   const selectedCommitData = selectedCommit
//     ? dummyCommits.find((c) => c.hash === selectedCommit)
//     : null;

//   return (
//     <div className="flex relative">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-900 text-white p-4">
//         <h1 className="text-xl font-bold">Git Visualizer</h1>

//         {/* Branch Filter */}
//         <label className="block mt-6 mb-2 text-sm">Filter by Branch:</label>
//         <select
//           className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
//           value={selectedBranch}
//           onChange={(e) => setSelectedBranch(e.target.value)}
//         >
//           {branches.map((b) => (
//             <option key={b} value={b}>
//               {b}
//             </option>
//           ))}
//         </select>

//         <ul className="mt-6 space-y-2">
//           <li className="text-yellow-400">Branches</li>
//           <li>Commits</li>
//           <li>Settings</li>
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-8 bg-gray-100">
//         <h2 className="text-2xl font-bold mb-4">Commit Visualization</h2>

//         {/* Search Bar */}
//         <input
//           type="text"
//           placeholder="Search commit by hash or message..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border p-2 rounded w-80 shadow-sm mb-4"
//         />

//         <ReactFlowProvider>
//           <BranchTree
//             selectedCommit={selectedCommit}
//             hoveredCommit={hoveredCommit}
//             searchTerm={searchTerm}
//             selectedBranch={selectedBranch}
//             onHover={setHoveredCommit}
//             onSelect={setSelectedCommit}
//           />
//           <CommitList
//             hoveredCommit={hoveredCommit}
//             searchTerm={searchTerm}
//             selectedBranch={selectedBranch}
//             onClickCommit={setSelectedCommit}
//             onHoverCommit={setHoveredCommit}
//           />
//         </ReactFlowProvider>
//       </div>

//       {/* ✅ Commit Details Panel */}
//       <CommitDetailsPanel
//         commit={selectedCommitData}
//         onClose={() => setSelectedCommit(null)}
//       />
//     </div>
//   );
// }

// export default App;
//--------------------------------------------------------------------------------------------------

import React, { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import BranchTree from './components/BranchTree';
import CommitList from './components/CommitList';
import CommitDetailsPanel from './components/CommitDetailsPanel';
import { dummyCommits } from './data/dummyCommits';

function App() {
  const [hoveredCommit, setHoveredCommit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const branches = ['all', ...new Set(dummyCommits.map((c) => c.branch))];

  const selectedCommitData = selectedCommit
    ? dummyCommits.find((c) => c.hash === selectedCommit)
    : null;

  return (
    <div className="flex relative h-screen overflow-hidden">
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 bg-gray-800 text-white p-2 rounded z-50"
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-900 text-white p-4 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <h1 className="text-xl font-bold">Git Visualizer</h1>

        {/* Branch Filter */}
        <label className="block mt-6 mb-2 text-sm">Filter by Branch:</label>
        <select
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          {branches.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <ul className="mt-6 space-y-2">
          <li className="text-yellow-400">Branches</li>
          <li>Commits</li>
          <li>Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 bg-gray-100 overflow-auto relative">
        <h2 className="text-2xl font-bold mb-4">Commit Visualization</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search commit by hash or message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-80 shadow-sm mb-4"
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-700 px-4 py-2 rounded shadow">
            {error}
          </div>
        )}

        <ReactFlowProvider>
          <BranchTree
            selectedCommit={selectedCommit}
            hoveredCommit={hoveredCommit}
            searchTerm={searchTerm}
            selectedBranch={selectedBranch}
            onHover={setHoveredCommit}
            onSelect={setSelectedCommit}
          />
          <CommitList
            hoveredCommit={hoveredCommit}
            searchTerm={searchTerm}
            selectedBranch={selectedBranch}
            onClickCommit={setSelectedCommit}
            onHoverCommit={setHoveredCommit}
          />
        </ReactFlowProvider>
      </div>

      {/* Commit Details Panel */}
      <CommitDetailsPanel
        commit={selectedCommitData}
        onClose={() => setSelectedCommit(null)}
      />
    </div>
  );
}

export default App;


