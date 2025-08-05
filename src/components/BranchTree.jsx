// // // // import React from "react";
// // // // import ReactFlow, {
// // // //   Background,
// // // //   Controls,
// // // //   MiniMap,
// // // // } from "reactflow";
// // // // import "reactflow/dist/style.css";

// // // // // Step 1: Define Nodes (commits)
// // // // const nodes = [
// // // //   {
// // // //     id: "1",
// // // //     position: { x: 50, y: 50 },
// // // //     data: { label: "a1b2c3 (main)" },
// // // //   },
// // // //   {
// // // //     id: "2",
// // // //     position: { x: 200, y: 150 },
// // // //     data: { label: "d4e5f6 (main)" },
// // // //   },
// // // //   {
// // // //     id: "3",
// // // //     position: { x: 200, y: -50 },
// // // //     data: { label: "g7h8i9 (feature-x)" },
// // // //   },
// // // // ];

// // // // // Step 2: Define Edges (branches/merges)
// // // // const edges = [
// // // //   { id: "e1-2", source: "1", target: "2", animated: true },
// // // //   { id: "e1-3", source: "1", target: "3", style: { stroke: "orange" } },
// // // // ];

// // // // export default function BranchTree() {
// // // //   return (
// // // //     <div className="h-full w-full bg-gray-100 rounded p-2">
// // // //       <ReactFlow
// // // //         nodes={nodes}
// // // //         edges={edges}
// // // //         fitView
// // // //       >
// // // //         {/* Optional helpers */}
// // // //         <Background color="#aaa" gap={16} />
// // // //         <MiniMap nodeColor="#2563eb" />
// // // //         <Controls />
// // // //       </ReactFlow>
// // // //     </div>
// // // //   );
// // // // }
// // // //---------------------------------------------------------------------------------------------

// // // import React, { useMemo } from "react";
// // // import ReactFlow, {
// // //   MiniMap,
// // //   Controls,
// // //   Background,
// // //   Handle,
// // // } from "reactflow";
// // // import "reactflow/dist/style.css";
// // // import { commits } from "../data/commits";

// // // // Custom Node for Tooltip
// // // function CommitNode({ data }) {
// // //   return (
// // //     <div className="relative group">
// // //       <div className="px-3 py-2 bg-white border rounded shadow text-xs font-bold">
// // //         {data.label}
// // //       </div>
// // //       {/* Tooltip */}
// // //       <div className="absolute left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block z-50">
// // //         <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
// // //           {data.message} • {data.author} • {data.date}
// // //         </div>
// // //       </div>
// // //       <Handle type="target" position="top" />
// // //       <Handle type="source" position="bottom" />
// // //     </div>
// // //   );
// // // }

// // // const nodeTypes = { commitNode: CommitNode };

// // // export default function BranchTree() {
// // //   const { nodes, edges } = useMemo(() => {
// // //     const nodes = [];
// // //     const edges = [];

// // //     const branchOffsets = { main: 0 }; // y-offset for branches
// // //     const branchXIndex = {}; // track commits per branch for X positioning
// // //     const verticalSpacing = 120; // distance between commits
// // //     const horizontalSpacing = 200; // distance between branches

// // //     // Determine vertical offsets for each branch
// // //     const uniqueBranches = [...new Set(commits.map((c) => c.branch))];
// // //     uniqueBranches.forEach((branch, i) => {
// // //       branchOffsets[branch] = (branch === "main" ? 0 : (i % 2 ? 1 : -1) * 150);
// // //       branchXIndex[branch] = 0;
// // //     });

// // //     commits.forEach((commit) => {
// // //       branchXIndex[commit.branch] += 1;

// // //       const x = branchXIndex[commit.branch] * horizontalSpacing;
// // //       const y = branchOffsets[commit.branch];

// // //       // Node
// // //       nodes.push({
// // //         id: commit.id,
// // //         type: "commitNode",
// // //         position: { x, y },
// // //         data: {
// // //           label: commit.id,
// // //           message: commit.message,
// // //           author: commit.author,
// // //           date: commit.date,
// // //         },
// // //       });

// // //       // Edge to parent
// // //       if (commit.parent) {
// // //         edges.push({
// // //           id: `e-${commit.parent}-${commit.id}`,
// // //           source: commit.parent,
// // //           target: commit.id,
// // //           type: "smoothstep",
// // //           animated: commit.branch === "main",
// // //           style: {
// // //             stroke: commit.branch === "main" ? "blue" : "orange",
// // //             strokeDasharray: "0",
// // //           },
// // //         });
// // //       }
// // //     });

// // //     return { nodes, edges };
// // //   }, []);

// // //   return (
// // //     <div style={{ height: 400 }}>
// // //       <ReactFlow
// // //         nodes={nodes}
// // //         edges={edges}
// // //         nodeTypes={nodeTypes}
// // //         fitView
// // //         zoomOnScroll
// // //         zoomOnPinch
// // //         panOnDrag
// // //       >
// // //         <MiniMap />
// // //         <Controls />
// // //         <Background gap={20} color="#aaa" />
// // //       </ReactFlow>
// // //     </div>
// // //   );
// // // }
// // //--------------------------------------------------------------------------------------------------
// // import React, { useMemo } from 'react';
// // import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
// // import 'reactflow/dist/style.css';

// // import { dummyCommits } from '../data/dummyCommits';
// // import { branchColors, activityColors } from '../utils/colors';
// // import CommitNode from './CommitNode'; // ✅ Import custom node

// // export default function BranchTree() {
// //   const nodeTypes = useMemo(
// //     () => ({
// //       commitNode: CommitNode, // ✅ Register custom node
// //     }),
// //     []
// //   );

// //   // Generate Nodes & Edges dynamically
// //   const { nodes, edges } = useMemo(() => {
// //     const nodes = [];
// //     const edges = [];
// //     const branchOffset = { main: 0, 'feature-x': 200 }; // X-offset per branch
// //     const verticalGap = 120; // Distance between commits

// //     dummyCommits.forEach((commit, index) => {
// //       const x = 400 + (branchOffset[commit.branch] || 0);
// //       const y = 100 + index * verticalGap;

// //       // ✅ Node with tooltip data
// //       nodes.push({
// //         id: commit.hash,
// //         type: 'commitNode',
// //         position: { x, y },
// //         data: {
// //           label: commit.hash,
// //           author: commit.author,
// //           date: commit.date,
// //           color: activityColors[commit.activity],
// //           borderColor: branchColors[commit.branch],
// //         },
// //       });

// //       // ✅ Create edge to parent
// //       if (commit.parent) {
// //         edges.push({
// //           id: `${commit.parent}-${commit.hash}`,
// //           source: commit.parent,
// //           target: commit.hash,
// //           style: {
// //             stroke: branchColors[commit.branch],
// //             strokeWidth: 3,
// //           },
// //         });
// //       }
// //     });

// //     return { nodes, edges };
// //   }, []);

// //   return (
// //     <div style={{ width: '100%', height: '500px', position: 'relative' }}>
// //       <ReactFlow
// //         nodes={nodes}
// //         edges={edges}
// //         nodeTypes={nodeTypes} // ✅ Use custom node
// //         fitView
// //         style={{ background: '#f8fafc' }}
// //       >
// //         <Background />
// //         <MiniMap nodeStrokeColor="#555" nodeColor="#999" />
// //         <Controls />
// //       </ReactFlow>

// //       {/* ✅ Fixed Bottom-Right Legend */}
// //       <div className="fixed bottom-4 right-4 bg-white p-3 shadow-md rounded-md text-sm space-y-1">
// //         <p className="text-blue-500 font-bold">● Main Branch</p>
// //         <p className="text-orange-500 font-bold">● Feature Branch</p>
// //         <p className="text-red-400 font-bold">● High Activity</p>
// //       </div>
// //     </div>
// //   );
// // }
// //------------------------------------------------------------------------------------------------------

// import React, { useMemo, useState,useEffect } from 'react';
// import ReactFlow, { Background, Controls, MiniMap, useReactFlow } from 'reactflow';
// import 'reactflow/dist/style.css';

// import { dummyCommits } from '../data/dummyCommits';
// import { branchColors, activityColors } from '../utils/colors';
// import CommitNode from './CommitNode';
// import CommitList from './CommitList';



// export default function BranchTree() {
//   const [hoveredCommit, setHoveredCommit] = useState(null);
  

//   const nodeTypes = useMemo(() => ({
//     commitNode: (props) => (
//       <CommitNode
//         {...props}
//         onHover={(id) => setHoveredCommit(id)} // ✅ Track hover
//       />
//     ),
//   }), []);

//   const { nodes, edges } = useMemo(() => {
//     const nodes = [];
//     const edges = [];
//     const branchOffset = { main: 0, 'feature-x': 200 };
//     const verticalGap = 120;

//     dummyCommits.forEach((commit, index) => {
//       const x = 400 + (branchOffset[commit.branch] || 0);
//       const y = 100 + index * verticalGap;

//       nodes.push({
//         id: commit.hash,
//         type: 'commitNode',
//         position: { x, y },
//         data: {
//           label: commit.hash,
//           author: commit.author,
//           date: commit.date,
//           color: activityColors[commit.activity],
//           borderColor: branchColors[commit.branch],
//           branch: commit.branch,
//         },
//       });

//       if (commit.parent) {
//         edges.push({
//   id: `${commit.parent}-${commit.hash}`,
//   source: commit.parent,
//   target: commit.hash,
//   style: {
//     stroke: branchColors[commit.branch],
//     strokeWidth: 3,
//     strokeDasharray: commit.activity === 'medium' ? '6 3' : 'none', // ✅ Dashes for medium
//   },
//   animated: commit.activity === 'high',
// });
//       }
      

//     });

//     return { nodes, edges };
//   }, []);

  
  
//   return (
//     <div style={{ width: '100%', height: '500px', position: 'relative' }}>
//   <ReactFlow
//   nodes={nodes}
//   edges={edges}
//   nodeTypes={nodeTypes}
//   fitView
//   onInit={(instance) => instance.fitView({ padding: 0.2 })}
//   fitViewOptions={{ padding: 0.2 }}
//   panOnScroll
//   zoomOnScroll={false}
//   zoomOnPinch
//   panOnDrag
//   selectionOnDrag={false}
//   style={{ background: '#f8fafc' }}
// >
//   <Background />
//   <MiniMap
//     nodeStrokeColor={(node) => node.data.borderColor}
//     nodeColor={(node) => branchColors[node.data.branch] || '#999'}
//   />
//   <Controls showInteractive showFitView showZoom />
// </ReactFlow>

//       {/* ✅ Fixed Bottom-Right Legend */}
//       <div className="fixed bottom-4 right-4 bg-white p-3 shadow-md rounded-md text-sm space-y-1">
//         <p className="text-blue-500 font-bold">● Main Branch</p>
//         <p className="text-orange-500 font-bold">● Feature Branch</p>
//         <p className="text-red-400 font-bold">● High Activity</p>
//       </div>

//       {/* ✅ Commit List synced with hover */}
//       <CommitList hoveredCommit={hoveredCommit} />
//     </div>
//   );
// }
//--------------------------------------------------------------------------------------------------------------

import React, { useMemo, useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';

import { dummyCommits } from '../data/dummyCommits';
import { branchColors, activityColors } from '../utils/colors';
import CommitNode from './CommitNode';

export default function BranchTree({ searchTerm, setHoveredCommit }) {
  const { fitView, setCenter } = useReactFlow();

  const highlightedId = useMemo(() => {
    if (!searchTerm) return null;
    const found = dummyCommits.find(
      (c) =>
        c.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return found?.hash || null;
  }, [searchTerm]);

  const { nodes, edges } = useMemo(() => {
    const nodes = [];
    const edges = [];
    const branchOffset = { main: 0, 'feature-x': 200 };
    const verticalGap = 120;

    dummyCommits.forEach((commit, index) => {
      const x = 400 + (branchOffset[commit.branch] || 0);
      const y = 100 + index * verticalGap;

      nodes.push({
        id: commit.hash,
        type: 'commitNode',
        position: { x, y },
        data: {
          label: commit.hash,
          author: commit.author,
          date: commit.date,
          color: activityColors[commit.activity],
          borderColor: highlightedId === commit.hash ? '#22c55e' : branchColors[commit.branch],
          branch: commit.branch,
        },
      });

      if (commit.parent) {
        edges.push({
          id: `${commit.parent}-${commit.hash}`,
          source: commit.parent,
          target: commit.hash,
          style: {
            stroke: branchColors[commit.branch],
            strokeWidth: 3,
            strokeDasharray: commit.activity === 'medium' ? '6 3' : 'none',
          },
          animated: commit.activity === 'high',
        });
      }
    });

    return { nodes, edges };
  }, [highlightedId]);

  // ✅ Zoom to highlighted commit
  useEffect(() => {
    if (!highlightedId) return;
    const node = nodes.find((n) => n.id === highlightedId);
    if (node) {
      setCenter(node.position.x, node.position.y, { zoom: 1.5, duration: 800 });
    }
  }, [highlightedId, nodes, setCenter]);

  return (
    <div style={{ width: '100%', height: '550px', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ commitNode: (props) => <CommitNode {...props} onHover={setHoveredCommit} /> }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        panOnScroll
        zoomOnScroll={false}
        zoomOnPinch
        panOnDrag
        selectionOnDrag={false}
        style={{ background: '#f8fafc' }}
      >
        <Background />
        <MiniMap
          nodeStrokeColor={(node) => node.data.borderColor}
          nodeColor={(node) => branchColors[node.data.branch] || '#999'}
        />
        <Controls showInteractive showFitView showZoom />
      </ReactFlow>
    </div>
  );
}

