import React from "react";

function ContributorList({ contributors }) {
  if (!contributors || contributors.length === 0) return null;

  return (
    <div className="mt-16 mb-4">

      <h3 className="font-semibold mb-3 text-base text-white">Top Contributors</h3>
      <ul>
        {contributors.map(c => (
          <li
            key={c.login}
            className="flex items-center mb-3 px-0 py-1 rounded"
            style={{ minHeight: 40, gap: '10px' }}
          >
            <img
              src={c.avatar_url}
              alt={c.login}
              width={32}
              height={32}
              className="rounded-full mr-2 border border-gray-700"
              style={{ flexShrink: 0 }}
            />
            <span
              className="font-medium text-sm max-w-[90px] truncate"
              style={{ color: '#fff' }}
              title={c.login}
            >
              {c.login}
            </span>
            <span
              className="ml-auto text-xs text-gray-300 font-semibold"
              style={{ minWidth: 100, textAlign: 'right' }}
            >
              Commits: {c.contributions}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContributorList;

