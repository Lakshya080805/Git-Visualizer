import React from 'react';
import { branchColors, activityColors } from '../utils/colors';

export default function CommitDetailsPanel({ commit, onClose }) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg border-l border-gray-200 z-50 
      transform transition-transform duration-300
      ${commit ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-xl font-bold">Commit Details</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      {commit && (
        <div className="p-6 space-y-4">
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
        </div>
      )}
    </div>
  );
}
