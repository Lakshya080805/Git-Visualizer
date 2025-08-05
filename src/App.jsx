// // // // import { useState } from 'react'
// // // // import reactLogo from './assets/react.svg'
// // // // import viteLogo from '/vite.svg'
// // // // import './App.css'

// // // // function App() {
// // // //   const [count, setCount] = useState(0)

// // // //   return (
// // // //     <div className='text-[50px]'> 
// // // //       Hello World
// // // //     </div>
// // // //   )
// // // // }

// // // // export default App
// // // //------------------------------------------------------------------------
// // // import Sidebar from "./components/Sidebar";
// // // import MainView from "./components/MainView";

// // // export default function App() {
// // //   return (
// // //     <div className="flex h-screen">
// // //       <Sidebar />
// // //       <MainView />
// // //     </div>
// // //   );
// // // }
// // //-----------------------------------------------------------------------

// // import BranchTree from "./components/BranchTree";
// // import { commits } from "./data/commits";

// // function App() {
// //   return (
// //     <div className="flex">
// //       {/* Sidebar */}
// //       <div className="w-64 bg-gray-900 text-white p-4">
// //         <h1 className="text-xl font-bold">Git Visualizer</h1>
// //         <ul className="mt-4 space-y-2">
// //           <li className="text-yellow-400">Branches</li>
// //           <li>Commits</li>
// //           <li>Settings</li>
// //         </ul>
// //       </div>

// //       {/* Main Content */}
// //       <div className="flex-1 p-8 bg-gray-100">
// //         <h2 className="text-2xl font-bold mb-4">Commit Visualization</h2>

// //         {/* Branch Tree */}
// //         <BranchTree />

// //         {/* Commit List */}
// //         <div className="mt-6 space-y-2">
// //           {commits.map((c) => (
// //             <div
// //               key={c.id}
// //               className="bg-white p-4 shadow rounded hover:bg-gray-50"
// //             >
// //               <p className="font-bold">{c.message}</p>
// //               <p className="text-sm text-gray-600">
// //                 {c.author} • {c.date} • {c.id}
// //               </p>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default App;
// //-----------------------------------------------------------------------------------------------
// import React, { useState } from 'react';
// import BranchTree from './components/BranchTree';
// import CommitList from './components/CommitList';

// function App() {
//   const [hoveredCommit, setHoveredCommit] = useState(null); // ✅ Define state

//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-900 text-white p-4">
//         <h1 className="text-xl font-bold">Git Visualizer</h1>
//         <ul className="mt-4 space-y-2">
//           <li className="text-yellow-400">Branches</li>
//           <li>Commits</li>
//           <li>Settings</li>
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-8 bg-gray-100">
//         <h2 className="text-2xl font-bold mb-4">Commit Visualization</h2>

//         {/* Branch Tree */}
//         <BranchTree setHoveredCommit={setHoveredCommit} /> 

//         {/* ✅ Commit List (only once) */}
//         <CommitList hoveredCommit={hoveredCommit} />
//       </div>
//     </div>
//   );
// }

// export default App;
//===================================================================================================

import React, { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import BranchTree from './components/BranchTree';
import CommitList from './components/CommitList';

function App() {
  const [hoveredCommit, setHoveredCommit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold">Git Visualizer</h1>
        <ul className="mt-4 space-y-2">
          <li className="text-yellow-400">Branches</li>
          <li>Commits</li>
          <li>Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Commit Visualization</h2>

        {/* 🔍 Search Bar */}
        <input
          type="text"
          placeholder="Search commit by hash or message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-80 shadow-sm mb-4"
        />

        {/* ✅ Wrap with ReactFlowProvider */}
        <ReactFlowProvider>
          <BranchTree
            searchTerm={searchTerm}
            setHoveredCommit={setHoveredCommit}
          />
          <CommitList hoveredCommit={hoveredCommit} searchTerm={searchTerm} />
        </ReactFlowProvider>
      </div>
    </div>
  );
}

export default App;


