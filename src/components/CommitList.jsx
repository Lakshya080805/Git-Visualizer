import React, { useEffect, useRef } from 'react';
import { dummyCommits } from '../data/dummyCommits';
import { branchColors } from '../utils/colors';

export default function CommitList({
  hoveredCommit,
  searchTerm,
  selectedBranch,
  onClickCommit,
  onHoverCommit,
}) {
  const commitRefs = useRef({});

  // ✅ Filtered commits
  const commits = selectedBranch === 'all'
    ? dummyCommits
    : dummyCommits.filter((c) => c.branch === selectedBranch);

  // ✅ Scroll on hover
  useEffect(() => {
    if (hoveredCommit && commitRefs.current[hoveredCommit]) {
      commitRefs.current[hoveredCommit].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [hoveredCommit]);

  // ✅ Scroll on search
  useEffect(() => {
    if (!searchTerm) return;

    const found = commits.find(
      (c) =>
        c.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (found && commitRefs.current[found.hash]) {
      commitRefs.current[found.hash].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [searchTerm, selectedBranch]);

  return (
    <div className="space-y-4 mt-4 max-h-80 overflow-y-auto">
      {commits.map((commit) => (
        <div
          key={commit.hash}
          id={`commit-${commit.hash}`} // ✅ For smooth scroll on select
          ref={(el) => (commitRefs.current[commit.hash] = el)}
          onMouseEnter={() => onHoverCommit && onHoverCommit(commit.hash)}
          onMouseLeave={() => onHoverCommit && onHoverCommit(null)}
          onClick={() => onClickCommit && onClickCommit(commit.hash)}
          className={`cursor-pointer p-4 bg-white shadow rounded-lg border-l-4 transition
            ${hoveredCommit === commit.hash ? 'bg-blue-50 scale-[1.02]' : ''}
          `}
          style={{ borderLeftColor: branchColors[commit.branch] }}
        >
          <div className="flex justify-between items-center">
            <p className="font-bold">{commit.message}</p>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: branchColors[commit.branch], color: 'white' }}
            >
              {commit.branch}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {commit.author} • {commit.date} • {commit.hash}
          </p>
        </div>
      ))}
    </div>
  );
}
