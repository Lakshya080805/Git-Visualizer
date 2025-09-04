

import React, { useState, useEffect, useRef } from "react";
import { ReactFlowProvider } from "reactflow";
import BranchTree from "./components/BranchTree";
import CommitList from "./components/CommitList";
import ContributorList from "./components/ContributorList";
import CommitDetailsPanel from "./components/CommitDetailsPanel";
import LanguageChart from "./components/LanguageChart";
import CommitActivityChart from "./components/CommitActivityChart";
import DashboardSummary from "./components/DashboardSummary";

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
  try {
    let res = await fetch(url, options);
    if (!res.ok) {
      if (retries > 0 && (res.status === 403 || res.status >= 500)) {
        await new Promise((r) => setTimeout(r, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
      throw new Error(`API error: ${res.status}`);
    }
    return res;
  } catch (e) {
    if (retries === 0) throw e;
    await new Promise((r) => setTimeout(r, delay));
    return fetchWithRetry(url, options, retries - 1, delay * 2);
  }
}

function App() {
  const [inputOwner, setInputOwner] = useState("facebook");
  const [inputRepo, setInputRepo] = useState("react");
  const [debouncedOwner, setDebouncedOwner] = useState("facebook");
  const [debouncedRepo, setDebouncedRepo] = useState("react");

  const [branches, setBranches] = useState(["all"]);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [repoInfo, setRepoInfo] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [commits, setCommits] = useState([]);
  const [commitPage, setCommitPage] = useState(1);
  const [hasMoreCommits, setHasMoreCommits] = useState(true);

  const [hoveredCommit, setHoveredCommit] = useState(null);
  const [selectedCommit, setSelectedCommit] = useState(null);

  const [loadingCommits, setLoadingCommits] = useState(false);
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [loadingMoreCommits, setLoadingMoreCommits] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      if (inputOwner.trim().length >= 3 && inputRepo.trim().length >= 3) {
        setDebouncedOwner(inputOwner.trim());
        setDebouncedRepo(inputRepo.trim());
        setError(null);
        setCommitPage(1);
        setHasMoreCommits(true);
      } else {
        setRepoInfo(null);
        setBranches(["all"]);
        setSelectedBranch("all");
        setCommits([]);
        setContributors([]);
        setError(null);
        setCommitPage(1);
        setHasMoreCommits(true);
      }
    }, 800);

    return () => clearTimeout(debounceTimeout.current);
  }, [inputOwner, inputRepo]);

  useEffect(() => {
    async function fetchRepoAndBranches() {
      if (!debouncedOwner || !debouncedRepo || debouncedOwner.length < 3 || debouncedRepo.length < 3) {
        setRepoInfo(null);
        setBranches(["all"]);
        setSelectedBranch("all");
        setCommits([]);
        setContributors([]);
        setHasMoreCommits(true);
        return;
      }
      setLoadingRepo(true);
      setError(null);
      try {
        const res = await fetchWithRetry(`https://api.github.com/repos/${debouncedOwner}/${debouncedRepo}`, {
          headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
        });

        if (res.status === 403) throw new Error("API rate limit exceeded. Try again later.");
        if (res.status === 401) throw new Error("Authentication failed. Check your token.");
        if (res.status === 404) throw new Error("Repository not found.");

        const data = await res.json();
        const langRes = await fetchWithRetry(data.languages_url, {
          headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
        });
        const langData = await langRes.json();

        setRepoInfo({
          stars: data.stargazers_count,
          forks: data.forks_count,
          watchers: data.watchers_count,
          openIssues: data.open_issues_count,
          languages: langData,
          description: data.description,
          url: data.html_url,
          name: data.full_name,
        });

        const branchRes = await fetchWithRetry(`https://api.github.com/repos/${debouncedOwner}/${debouncedRepo}/branches`, {
          headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
        });

        if (!branchRes.ok) throw new Error("Failed to fetch branches.");
        const branchData = await branchRes.json();
        const branchNames = branchData.map(b => b.name);
        setBranches(["all", ...branchNames]);
        setSelectedBranch("all");
      } catch (err) {
        setRepoInfo(null);
        setBranches(["all"]);
        setSelectedBranch("all");
        setError(err.message);
      } finally {
        setLoadingRepo(false);
      }
    }
    fetchRepoAndBranches();
  }, [debouncedOwner, debouncedRepo]);

  useEffect(() => {
    async function fetchContributors() {
      if (!debouncedOwner || !debouncedRepo || debouncedOwner.length < 3 || debouncedRepo.length < 3) {
        setContributors([]);
        return;
      }
      try {
        const res = await fetchWithRetry(
          `https://api.github.com/repos/${debouncedOwner}/${debouncedRepo}/contributors?per_page=10`,
          { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
        );
        if (res.status === 403) throw new Error("Rate limited, try again.");
        if (res.status === 404) throw new Error("No contributors found.");
        const data = await res.json();
        setContributors(Array.isArray(data) ? data : []);
      } catch {
        setContributors([]);
      }
    }
    fetchContributors();
  }, [debouncedOwner, debouncedRepo]);

  useEffect(() => {
    async function fetchCommits() {
      if (!debouncedOwner || !debouncedRepo || debouncedOwner.length < 3 || debouncedRepo.length < 3) {
        setCommits([]);
        setHasMoreCommits(true);
        return;
      }
      setLoadingCommits(true);
      setError(null);
      try {
        let url = `https://api.github.com/repos/${debouncedOwner}/${debouncedRepo}/commits?per_page=50&page=1`;
        if (selectedBranch && selectedBranch !== "all") {
          url += `&sha=${selectedBranch}`;
        }
        const res = await fetchWithRetry(url, {
          headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
        });

        if (res.status === 403) throw new Error("API rate limit exceeded. Try again later.");
        if (res.status === 401) throw new Error("Authentication failed.");
        if (res.status === 404) throw new Error("No commits found.");

        const data = await res.json();
        const formatted = data.map(c => ({
          hash: c.sha.substring(0, 7),
          message: c.commit.message.split("\n")[0],
          author: c.commit.author?.name || "Unknown",
          date: new Date(c.commit.author.date).toLocaleDateString(),
          parent: c.parents[0]?.sha?.substring(0, 7) || null,
          branch: selectedBranch !== "all" ? selectedBranch : "",
          activity: "medium",
        }));
        setCommits(formatted);
        setHasMoreCommits(data.length === 50);
        setCommitPage(2);
      } catch (err) {
        setCommits([]);
        setError(err.message);
      } finally {
        setLoadingCommits(false);
      }
    }
    fetchCommits();
  }, [debouncedOwner, debouncedRepo, selectedBranch]);

  async function loadMoreCommits() {
    if (!hasMoreCommits || loadingMoreCommits) return;

    setLoadingMoreCommits(true);
    let url = `https://api.github.com/repos/${debouncedOwner}/${debouncedRepo}/commits?per_page=50&page=${commitPage}`;
    if (selectedBranch && selectedBranch !== "all") {
      url += `&sha=${selectedBranch}`;
    }

    try {
      const res = await fetchWithRetry(url, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
      });

      if (res.status === 403) throw new Error("API rate limit exceeded. Try again later.");
      if (res.status === 401) throw new Error("Authentication failed.");
      if (res.status === 404) throw new Error("No more commits found.");

      const data = await res.json();
      if (data.length === 0) {
        setHasMoreCommits(false);
      } else {
        const formatted = data.map(c => ({
          hash: c.sha.substring(0, 7),
          message: c.commit.message.split("\n")[0],
          author: c.commit.author?.name || "Unknown",
          date: new Date(c.commit.author.date).toLocaleDateString(),
          parent: c.parents[0]?.sha?.substring(0, 7) || null,
          branch: selectedBranch !== "all" ? selectedBranch : "",
          activity: "medium",
        }));

        setCommits(prev => [...prev, ...formatted]);
        setCommitPage(prev => prev + 1);
        if (data.length < 50) setHasMoreCommits(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMoreCommits(false);
    }
  }

  const selectedCommitData = selectedCommit ? commits.find(c => c.hash === selectedCommit) : null;

  // Total contributors and commits for summary
  const totalCommits = commits.length;
  const totalContributors = contributors.length;

  return (
    <div className="flex relative h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-72 bg-gray-900 text-white p-4 overflow-y-auto transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ maxHeight: "100vh" }}
      >
        <h1 className="text-xl font-bold mb-4">Git Visualizer</h1>

        {/* Input fields */}
        <div className="mb-4">
          <label className="block mb-1">Owner</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-800 text-white"
            placeholder="GitHub Owner"
            value={inputOwner}
            onChange={e => setInputOwner(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Repository</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-800 text-white"
            placeholder="Repository Name"
            value={inputRepo}
            onChange={e => setInputRepo(e.target.value)}
          />
        </div>

        {/* Branch selector */}
        <label className="block mb-2 mt-2 text-sm">Filter by Branch</label>
        <select
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
          value={selectedBranch}
          onChange={e => setSelectedBranch(e.target.value)}
        >
          {branches.map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>

        {/* Repo info loading */}
        {loadingRepo && <p className="mt-4 text-gray-300">Loading repository info...</p>}

        {/* Dashboard summary */}
        {repoInfo && (
          <>
            <DashboardSummary
              totalCommits={totalCommits}
              totalContributors={totalContributors}
              stars={repoInfo.stars}
              forks={repoInfo.forks}
              watchers={repoInfo.watchers}
              openIssues={repoInfo.openIssues}
            />

            {/* Repo detailed info */}
            <div className="mt-4 space-y-4">
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Repo:</strong>{" "}
                  <a href={repoInfo.url} target="_blank" rel="noreferrer" className="underline hover:text-yellow-400">
                    {repoInfo.name}
                  </a>
                </p>
                {/* <p>{repoInfo.description}</p>
                <p>⭐ {repoInfo.stars.toLocaleString()}</p>
                <p>🍴 {repoInfo.forks.toLocaleString()}</p>
                <p>👀 {repoInfo.watchers.toLocaleString()}</p>
                <p>⚠️ {repoInfo.openIssues.toLocaleString()}</p> */}
                <div>
                  <strong>Languages:</strong>{" "}
                  {Object.keys(repoInfo.languages).map(lang => (
                    <span key={lang} className="inline-block mr-2 px-2 rounded bg-gray-700">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 mb-6">
                <LanguageChart languages={repoInfo.languages} />
              </div>

              <ContributorList contributors={contributors} />
            </div>
          </>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 p-2 bg-red-600 bg-opacity-75 rounded text-white font-semibold">
            {error}
            <button
              onClick={() => {
                setError(null);
                setRepoInfo(null);
                setContributors([]);
                setCommits([]);
                setHasMoreCommits(true);
                setCommitPage(1);
              }}
              className="ml-4 underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Commit Visualization</h2>

        <CommitActivityChart commits={commits} />

        {loadingCommits && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
          </div>
        )}

        {commits.length > 0 ? (
          <>
            <ReactFlowProvider>
              <BranchTree
                commits={commits}
                hoveredCommit={hoveredCommit}
                selectedCommit={selectedCommit}
                selectedBranch={selectedBranch}
                onHover={setHoveredCommit}
                onSelect={setSelectedCommit}
              />
            </ReactFlowProvider>

            <CommitList
              commits={commits}
              hoveredCommit={hoveredCommit}
              selectedCommit={selectedCommit}
              selectedBranch={selectedBranch}
              onClick={setSelectedCommit}
              onHover={setHoveredCommit}
            />

            {hasMoreCommits && (
              <div className="mt-4 text-center">
                <button
                  className="rounded px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  onClick={loadMoreCommits}
                  disabled={loadingMoreCommits}
                >
                  {loadingMoreCommits ? "Loading..." : "Load More Commits"}
                </button>
              </div>
            )}
          </>
        ) : (
          !loadingCommits && <p className="text-gray-600">No commits found.</p>
        )}
      </div>

      <CommitDetailsPanel commit={selectedCommitData} onClose={() => setSelectedCommit(null)} />
    </div>
  );
}

export default App;

