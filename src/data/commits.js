export const commits = [
  {
    id: "a1b2c3",
    message: "Initial commit",
    author: "Alice",
    date: "2025-07-01",
    branch: "main",
    parent: null,
  },
  {
    id: "d4e5f6",
    message: "Added feature X",
    author: "Bob",
    date: "2025-07-02",
    branch: "main",
    parent: "a1b2c3",
  },
  {
    id: "g7h8i9",
    message: "Fixed bug Y",
    author: "Alice",
    date: "2025-07-03",
    branch: "feature-x",
    parent: "a1b2c3",
  },
  {
    id: "j1k2l3",
    message: "Feature X improvements",
    author: "Bob",
    date: "2025-07-04",
    branch: "feature-x",
    parent: "g7h8i9",
  },
];
