import React from "react";

function DashboardSummary({ totalCommits, totalContributors, stars, forks, watchers, openIssues }) {
  return (
    <div className="mb-6 p-4 bg-gray-800 rounded-lg text-white space-y-2">
      <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">Dashboard Summary</h3>
      <div className="flex flex-col gap-1 text-sm">
        <div><strong>Total Commits:</strong> {totalCommits.toLocaleString()}</div>
        <div><strong>Total Contributors:</strong> {totalContributors.toLocaleString()}</div>
        <div><strong>Stars:</strong> {stars.toLocaleString()}</div>
        <div><strong>Forks:</strong> {forks.toLocaleString()}</div>
        <div><strong>Watchers:</strong> {watchers.toLocaleString()}</div>
        <div><strong>Open Issues:</strong> {openIssues.toLocaleString()}</div>
      </div>
    </div>
  );
}

export default DashboardSummary;
