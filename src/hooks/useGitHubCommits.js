// src/hooks/useGitHubCommits.js
import { useEffect, useState } from "react";

export default function useGitHubCommits(owner, repo, branch) {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!owner || !repo) return;

    const fetchCommits = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=30${
          branch && branch !== "all" ? `&sha=${branch}` : ""
        }`;

        const res = await fetch(url);

        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const data = await res.json();

        // Transform API response to match our app format
        const formatted = data.map((c) => ({
          hash: c.sha.substring(0, 7),
          message: c.commit.message.split("\n")[0],
          author: c.commit.author?.name || "Unknown",
          date: new Date(c.commit.author?.date).toISOString().split("T")[0],
          branch: branch || "main",
          parent: c.parents[0]?.sha?.substring(0, 7) || null,
          activity: "medium", // We can infer from commit frequency later
        }));

        setCommits(formatted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommits();
  }, [owner, repo, branch]);

  return { commits, loading, error };
}
