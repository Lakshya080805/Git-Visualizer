// src/data/dummyCommits.js
export const dummyCommits = [
  {
    hash: 'a1b2c3',
    message: 'Initial commit',
    author: 'Alice',
    date: '2025-07-01',
    branch: 'main',
    parent: null,
    activity: 'low',
  },
  {
    hash: 'd4e5f6',
    message: 'Added feature X',
    author: 'Bob',
    date: '2025-07-02',
    branch: 'main',
    parent: 'a1b2c3',
    activity: 'medium',
  },
  {
    hash: 'g7h8i9',
    message: 'Feature branch commit',
    author: 'Alice',
    date: '2025-07-03',
    branch: 'feature-x',
    parent: 'a1b2c3',
    activity: 'high',
  },
  {
    hash: 'j1k2l3',
    message: 'More feature work',
    author: 'Bob',
    date: '2025-07-04',
    branch: 'feature-x',
    parent: 'g7h8i9',
    activity: 'medium',
  },
]
