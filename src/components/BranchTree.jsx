

import React, { useMemo, useEffect, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";

import { branchColors, activityColors } from "../utils/colors";
import CommitNode from "./CommitNode";

export default function BranchTree({
  commits = [],
  selectedCommit,
  hoveredCommit,
  onHover,
  onSelect,
  searchTerm,
  selectedBranch,
}) {
  const { setCenter } = useReactFlow();
  const [highlightedNode, setHighlightedNode] = useState(null);

  // ✅ Search matching
  const searchMatch = useMemo(() => {
    if (!searchTerm || !commits.length) return null;
    const found = commits.find(
      (c) =>
        c.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return found?.hash || null;
  }, [searchTerm, commits]);

  // ✅ Effective highlight (hover > click > search)
  const effectiveHighlight = hoveredCommit || highlightedNode || searchMatch;

  // ✅ Filter commits by selected branch
  const filteredCommits = useMemo(() => {
    if (!selectedBranch || selectedBranch === "all") return commits;
    return commits.filter((c) => c.branch === selectedBranch);
  }, [selectedBranch, commits]);

  // ✅ Node types
  const nodeTypes = useMemo(
    () => ({
      commitNode: (props) => (
        <CommitNode
          {...props}
          onHover={onHover}
          onClick={(id) => {
            onSelect(id);
            setHighlightedNode(id); // Trigger pulse
          }}
        />
      ),
    }),
    [onHover, onSelect]
  );

  // ✅ Compute nodes and edges
  const { nodes, edges } = useMemo(() => {
    const nodes = [];
    const edges = [];
    const branchOffset = { main: 0, "feature-x": 200 }; // Can expand for multiple branches
    const verticalGap = 140;

    filteredCommits.forEach((commit, index) => {
      const x = 400 + (branchOffset[commit.branch] || (index % 2) * 200);
      const y = 100 + index * verticalGap;
      const isHighlighted = effectiveHighlight === commit.hash;

      // Node
      nodes.push({
        id: commit.hash,
        type: "commitNode",
        position: { x, y },
        data: {
          label: commit.hash,
          author: commit.author,
          date: commit.date,
          color: activityColors[commit.activity] || "#4b5563",
          borderColor: isHighlighted ? "#22c55e" : branchColors[commit.branch],
          branch: commit.branch,
          isHighlighted,
        },
      });

      // Edge
      if (commit.parent && filteredCommits.some((c) => c.hash === commit.parent)) {
        edges.push({
          id: `${commit.parent}-${commit.hash}`,
          source: commit.parent,
          target: commit.hash,
          type: "smoothstep", // Curved for visibility
          animated: commit.activity === "high",
          style: {
            strokeWidth: isHighlighted ? 4 : 3,
            stroke: branchColors[commit.branch] || "#1f2937",
            strokeDasharray: commit.activity === "medium" ? "6 3" : "none",
            transition: "stroke 0.3s ease, stroke-width 0.3s ease",
          },
          markerEnd: {
            type: "arrowclosed",
            color: branchColors[commit.branch] || "#1f2937",
          },
        });
      }
    });

    return { nodes, edges };
  }, [highlightedNode, hoveredCommit, searchMatch, filteredCommits]);

  // ✅ Center graph on selected commit
  useEffect(() => {
    if (selectedCommit && commits.length) {
      const targetCommit = commits.find((c) => c.hash === selectedCommit);
      if (!targetCommit) return;

      const index = commits.findIndex((c) => c.hash === selectedCommit);
      const x = 400 + (targetCommit.branch === "feature-x" ? 200 : 0);
      const y = 100 + index * 120;

      setCenter(x, y, { zoom: 2, duration: 1000 });
      setHighlightedNode(selectedCommit);

      const timeout = setTimeout(() => setHighlightedNode(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [selectedCommit, commits, setCenter]);

  // ✅ Empty state
  if (!commits.length) {
    return (
      <div className="w-full h-[550px] flex items-center justify-center bg-gray-100 text-gray-500">
        No commits to display
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "550px", position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{ type: "smoothstep" }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        panOnScroll
        zoomOnScroll={false}
        zoomOnPinch
        panOnDrag
        selectionOnDrag={false}
        style={{ background: "#edf1f6", zIndex: 2 }}
      >
        <Background />
        <MiniMap
          nodeStrokeColor={(node) =>
            node.data.isHighlighted ? "#22c55e" : node.data.borderColor
          }
          nodeColor={(node) =>
            node.data.isHighlighted
              ? "#22c55e"
              : branchColors[node.data.branch] || "#999"
          }
        />
        <Controls showInteractive showFitView showZoom />
      </ReactFlow>
    </div>
  );
}
