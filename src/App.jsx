import React, { useState, useEffect, useRef } from "react";
import { ReactFlowProvider } from "reactflow";
import BranchTree from "./components/BranchTree";
import CommitList from "./components/CommitList";
import ContributorList from "./components/ContributorList";
import CommitDetailsPanel from "./components/CommitDetailsPanel";
import LanguageChart from "./components/LanguageChart";
import CommitActivityChart from "./components/CommitActivityChart";
import DashboardSummary from "./components/DashboardSummary";

import { downloadCsv } from "./utils/exportCsv";
import { exportPdfReport } from "./utils/exportPdf";

import {
  getPullRequestsForCommit,
  findReferencedIssuesInMessage,
  getIssueDetails,
} from "./utils/githubCommitLinks";

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

  const [repoUrl, setRepoUrl] = useState("");
  const [urlError, setUrlError] = useState(null);

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

  const languageChartRef = useRef(null);
  const commitActivityChartRef = useRef(null);

  // New states for linked PRs and Issues
  const [linkedPRs, setLinkedPRs] = useState([]);
  const [linkedIssues, setLinkedIssues] = useState([]);

  // New state for PR status filter
  const [prStatusFilter, setPrStatusFilter] = useState("all");

  function parseGitHubUrl(url) {
    try {
      const u = new URL(url);
      if (u.hostname !== "github.com") return null;
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length < 2) return null;
      return {
        owner: parts[0],
        repo: parts[1],
      };
    } catch {
      return null;
    }
  }

  function handleRepoUrlChange(e) {
    const value = e.target.value;
    setRepoUrl(value);
    setUrlError(null);

    if (value.trim() === "") {
      return;
    }

    const parsed = parseGitHubUrl(value);
    if (!parsed) {
      setUrlError("Invalid GitHub repository URL");
      return;
    }

    setInputOwner(parsed.owner);
    setInputRepo(parsed.repo);
  }

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
        const res = await fetchWithRetry(
          `https://api.github.com/repos/${debouncedOwner}/${debouncedRepo}`,
          { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
        );

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

        const branchRes = await fetchWithRetry(
          `https://api.github.com/repos/${debouncedOwner}/${debouncedRepo}/branches`,
          { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
        );

        if (!branchRes.ok) throw new Error("Failed to fetch branches.");
        const branchData = await branchRes.json();
        const branchNames = branchData.map((b) => b.name);
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
        const formatted = data.map((c) => ({
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
        const formatted = data.map((c) => ({
          hash: c.sha.substring(0, 7),
          message: c.commit.message.split("\n")[0],
          author: c.commit.author?.name || "Unknown",
          date: new Date(c.commit.author.date).toLocaleDateString(),
          parent: c.parents[0]?.sha?.substring(0, 7) || null,
          branch: selectedBranch !== "all" ? selectedBranch : "",
          activity: "medium",
        }));

        setCommits((prev) => [...prev, ...formatted]);
        setCommitPage((prev) => prev + 1);
        if (data.length < 50) setHasMoreCommits(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMoreCommits(false);
    }
  }

  // Fetch linked PRs and issues for selected commit
  useEffect(() => {
    async function fetchLinksForSelectedCommit() {
      if (!selectedCommit) {
        setLinkedPRs([]);
        setLinkedIssues([]);
        return;
      }

      try {
        const commitData = commits.find((c) => c.hash === selectedCommit);
        if (!commitData) {
          setLinkedPRs([]);
          setLinkedIssues([]);
          return;
        }
        const prs = await getPullRequestsForCommit(debouncedOwner, debouncedRepo, commitData.hash, GITHUB_TOKEN);
        setLinkedPRs(prs);

        const issueNumbers = findReferencedIssuesInMessage(commitData.message);
        const issuesPromises = issueNumbers.map((num) =>
          getIssueDetails(debouncedOwner, debouncedRepo, num, GITHUB_TOKEN).catch(() => null)
        );
        const issues = (await Promise.all(issuesPromises)).filter(Boolean);
        setLinkedIssues(issues);
      } catch (error) {
        console.error("Error fetching linked PRs/issues:", error);
        setLinkedPRs([]);
        setLinkedIssues([]);
      }
    }

    fetchLinksForSelectedCommit();
  }, [selectedCommit, commits, debouncedOwner, debouncedRepo]);

  const selectedCommitData = selectedCommit ? commits.find((c) => c.hash === selectedCommit) : null;

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

        {/* Repo URL input */}
        <div className="mb-4">
          <label className="block mb-1">Repository URL</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-800 text-white"
            placeholder="Paste GitHub repository URL (e.g., https://github.com/owner/repo)"
            value={repoUrl}
            onChange={handleRepoUrlChange}
          />
          {urlError && <p className="text-red-400 mt-1 text-sm">{urlError}</p>}
        </div>

        {/* Owner input */}
        <div className="mb-4">
          <label className="block mb-1">Owner</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-800 text-white"
            placeholder="GitHub Owner"
            value={inputOwner}
            onChange={(e) => setInputOwner(e.target.value)}
          />
        </div>

        {/* Repository input */}
        <div className="mb-4">
          <label className="block mb-1">Repository</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-800 text-white"
            placeholder="Repository Name"
            value={inputRepo}
            onChange={(e) => setInputRepo(e.target.value)}
          />
        </div>

        {/* Branch selector */}
        <label className="block mb-2 mt-2 text-sm">Filter by Branch</label>
        <select
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          {branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>

        {/* Export buttons */}
        <div className="mb-6 space-y-2">
          <button
            className="w-full py-2 bg-green-600 rounded text-white hover:bg-green-700"
            onClick={() => downloadCsv(commits, "commit_history.csv")}
          >
            Export Commits CSV
          </button>
          <button
            className="w-full py-2 bg-purple-600 rounded text-white hover:bg-purple-700"
            onClick={() => downloadCsv(contributors, "contributors.csv")}
          >
            Export Contributors CSV
          </button>
          <button
            className="w-full py-2 bg-blue-600 rounded text-white hover:bg-blue-700"
            onClick={() =>
              exportPdfReport("Commit History Report", commits, commitActivityChartRef, "commit_report.pdf")
            }
          >
            Export Commits PDF
          </button>
        </div>

        {loadingRepo && <p className="mt-4 text-gray-300">Loading repository info...</p>}

        {repoInfo && (
          <>
            <DashboardSummary
              totalCommits={commits.length}
              totalContributors={contributors.length}
              stars={repoInfo.stars}
              forks={repoInfo.forks}
              watchers={repoInfo.watchers}
              openIssues={repoInfo.openIssues}
            />

            <div className="mt-4 space-y-4">
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Repo:</strong>{" "}
                  <a href={repoInfo.url} target="_blank" rel="noreferrer" className="underline hover:text-yellow-400">
                    {repoInfo.name}
                  </a>
                </p>
                <div>
                  <strong>Languages:</strong>{" "}
                  {Object.keys(repoInfo.languages).map((lang) => (
                    <span key={lang} className="inline-block mr-2 px-2 rounded bg-gray-700">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 mb-6">
                <LanguageChart ref={languageChartRef} languages={repoInfo.languages} />
              </div>

              <ContributorList contributors={contributors} />
            </div>
          </>
        )}

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

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto bg-gray-100">
        <CommitActivityChart ref={commitActivityChartRef} commits={commits} />

        <h2 className="text-2xl font-bold mb-6">Commit Visualization</h2>

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

      {/* Commit Details Panel */}
      <CommitDetailsPanel
        commit={selectedCommitData}
        linkedPRs={linkedPRs}
        linkedIssues={linkedIssues}
        onClose={() => setSelectedCommit(null)}
        prStatusFilter={prStatusFilter}
        setPrStatusFilter={setPrStatusFilter}
      />
    </div>
  );
}

export default App;

// import React, { useState, useEffect, useRef } from "react";
// import { ReactFlowProvider } from "reactflow";
// import BranchTree from "./components/BranchTree";
// import CommitList from "./components/CommitList";
// import ContributorList from "./components/ContributorList";
// import CommitDetailsPanel from "./components/CommitDetailsPanel";
// import LanguageChart from "./components/LanguageChart";
// import CommitActivityChart from "./components/CommitActivityChart";
// import DashboardSummary from "./components/DashboardSummary";

// import { downloadCsv } from "./utils/exportCsv";
// import { exportPdfReport } from "./utils/exportPdf";

// import {
//   getPullRequestsForCommit,
//   findReferencedIssuesInMessage,
//   getIssueDetails,
// } from "./utils/githubCommitLinks";

// // Removed token from frontend for security
// // const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

// async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
//   try {
//     let res = await fetch(url, options);
//     if (!res.ok) {
//       if (retries > 0 && (res.status === 403 || res.status >= 500)) {
//         await new Promise((r) => setTimeout(r, delay));
//         return fetchWithRetry(url, options, retries - 1, delay * 2);
//       }
//       throw new Error(`API error: ${res.status}`);
//     }
//     return res;
//   } catch (e) {
//     if (retries === 0) throw e;
//     await new Promise((r) => setTimeout(r, delay));
//     return fetchWithRetry(url, options, retries - 1, delay * 2);
//   }
// }

// function App() {
//   const [inputOwner, setInputOwner] = useState("facebook");
//   const [inputRepo, setInputRepo] = useState("react");
//   const [debouncedOwner, setDebouncedOwner] = useState("facebook");
//   const [debouncedRepo, setDebouncedRepo] = useState("react");

//   const [repoUrl, setRepoUrl] = useState("");
//   const [urlError, setUrlError] = useState(null);

//   const [branches, setBranches] = useState(["all"]);
//   const [selectedBranch, setSelectedBranch] = useState("all");
//   const [repoInfo, setRepoInfo] = useState(null);
//   const [contributors, setContributors] = useState([]);
//   const [commits, setCommits] = useState([]);
//   const [commitPage, setCommitPage] = useState(1);
//   const [hasMoreCommits, setHasMoreCommits] = useState(true);

//   const [hoveredCommit, setHoveredCommit] = useState(null);
//   const [selectedCommit, setSelectedCommit] = useState(null);

//   const [loadingCommits, setLoadingCommits] = useState(false);
//   const [loadingRepo, setLoadingRepo] = useState(false);
//   const [loadingMoreCommits, setLoadingMoreCommits] = useState(false);
//   const [error, setError] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const debounceTimeout = useRef(null);

//   const languageChartRef = useRef(null);
//   const commitActivityChartRef = useRef(null);

//   // New states for linked PRs and Issues
//   const [linkedPRs, setLinkedPRs] = useState([]);
//   const [linkedIssues, setLinkedIssues] = useState([]);

//   // New state for PR status filter
//   const [prStatusFilter, setPrStatusFilter] = useState("all");

//   function parseGitHubUrl(url) {
//     try {
//       const u = new URL(url);
//       if (u.hostname !== "github.com") return null;
//       const parts = u.pathname.split("/").filter(Boolean);
//       if (parts.length < 2) return null;
//       return {
//         owner: parts[0],
//         repo: parts[1],
//       };
//     } catch {
//       return null;
//     }
//   }

//   function handleRepoUrlChange(e) {
//     const value = e.target.value;
//     setRepoUrl(value);
//     setUrlError(null);

//     if (value.trim() === "") {
//       return;
//     }

//     const parsed = parseGitHubUrl(value);
//     if (!parsed) {
//       setUrlError("Invalid GitHub repository URL");
//       return;
//     }

//     setInputOwner(parsed.owner);
//     setInputRepo(parsed.repo);
//   }

//   useEffect(() => {
//     if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

//     debounceTimeout.current = setTimeout(() => {
//       if (inputOwner.trim().length >= 3 && inputRepo.trim().length >= 3) {
//         setDebouncedOwner(inputOwner.trim());
//         setDebouncedRepo(inputRepo.trim());
//         setError(null);
//         setCommitPage(1);
//         setHasMoreCommits(true);
//       } else {
//         setRepoInfo(null);
//         setBranches(["all"]);
//         setSelectedBranch("all");
//         setCommits([]);
//         setContributors([]);
//         setError(null);
//         setCommitPage(1);
//         setHasMoreCommits(true);
//       }
//     }, 800);

//     return () => clearTimeout(debounceTimeout.current);
//   }, [inputOwner, inputRepo]);

//   useEffect(() => {
//     async function fetchRepoAndBranches() {
//       if (
//         !debouncedOwner ||
//         !debouncedRepo ||
//         debouncedOwner.length < 3 ||
//         debouncedRepo.length < 3
//       ) {
//         setRepoInfo(null);
//         setBranches(["all"]);
//         setSelectedBranch("all");
//         setCommits([]);
//         setContributors([]);
//         setHasMoreCommits(true);
//         return;
//       }
//       setLoadingRepo(true);
//       setError(null);
//       try {
//         const res = await fetchWithRetry(
//           `http://localhost:4000/api/repos/${debouncedOwner}/${debouncedRepo}`,
//           {}
//         );

//         if (res.status === 403)
//           throw new Error("API rate limit exceeded. Try again later.");
//         if (res.status === 401) throw new Error("Authentication failed.");
//         if (res.status === 404) throw new Error("Repository not found.");

//         const data = await res.json();

//         const langRes = await fetchWithRetry(
//           `http://localhost:4000/api/repos/${debouncedOwner}/${debouncedRepo}/languages`,
//           {}
//         );
//         const langData = await langRes.json();

//         setRepoInfo({
//           stars: data.stargazers_count,
//           forks: data.forks_count,
//           watchers: data.watchers_count,
//           openIssues: data.open_issues_count,
//           languages: langData,
//           description: data.description,
//           url: data.html_url,
//           name: data.full_name,
//         });

//         const branchRes = await fetchWithRetry(
//           `http://localhost:4000/api/repos/${debouncedOwner}/${debouncedRepo}/branches`,
//           {}
//         );

//         if (!branchRes.ok) throw new Error("Failed to fetch branches.");
//         const branchData = await branchRes.json();
//         const branchNames = branchData.map((b) => b.name);
//         setBranches(["all", ...branchNames]);
//         setSelectedBranch("all");
//       } catch (err) {
//         setRepoInfo(null);
//         setBranches(["all"]);
//         setSelectedBranch("all");
//         setError(err.message);
//       } finally {
//         setLoadingRepo(false);
//       }
//     }
//     fetchRepoAndBranches();
//   }, [debouncedOwner, debouncedRepo]);

//   useEffect(() => {
//     async function fetchContributors() {
//       if (
//         !debouncedOwner ||
//         !debouncedRepo ||
//         debouncedOwner.length < 3 ||
//         debouncedRepo.length < 3
//       ) {
//         setContributors([]);
//         return;
//       }
//       try {
//         const res = await fetchWithRetry(
//           `http://localhost:4000/api/repos/${debouncedOwner}/${debouncedRepo}/contributors?per_page=10`,
//           {}
//         );
//         if (res.status === 403) throw new Error("Rate limited, try again.");
//         if (res.status === 404) throw new Error("No contributors found.");
//         const data = await res.json();
//         setContributors(Array.isArray(data) ? data : []);
//       } catch {
//         setContributors([]);
//       }
//     }
//     fetchContributors();
//   }, [debouncedOwner, debouncedRepo]);

//   useEffect(() => {
//     async function fetchCommits() {
//       if (
//         !debouncedOwner ||
//         !debouncedRepo ||
//         debouncedOwner.length < 3 ||
//         debouncedRepo.length < 3
//       ) {
//         setCommits([]);
//         setHasMoreCommits(true);
//         return;
//       }
//       setLoadingCommits(true);
//       setError(null);
//       try {
//         let url = `http://localhost:4000/api/repos/${debouncedOwner}/${debouncedRepo}/commits?per_page=50&page=1`;
//         if (selectedBranch && selectedBranch !== "all") {
//           url += `&sha=${selectedBranch}`;
//         }
//         const res = await fetchWithRetry(url, {});

//         if (res.status === 403)
//           throw new Error("API rate limit exceeded. Try again later.");
//         if (res.status === 401) throw new Error("Authentication failed.");
//         if (res.status === 404) throw new Error("No commits found.");

//         const data = await res.json();
//         const formatted = data.map((c) => ({
//           hash: c.sha.substring(0, 7),
//           message: c.commit.message.split("\n")[0],
//           author: c.commit.author?.name || "Unknown",
//           date: new Date(c.commit.author.date).toLocaleDateString(),
//           parent: c.parents[0]?.sha?.substring(0, 7) || null,
//           branch: selectedBranch !== "all" ? selectedBranch : "",
//           activity: "medium",
//         }));
//         setCommits(formatted);
//         setHasMoreCommits(data.length === 50);
//         setCommitPage(2);
//       } catch (err) {
//         setCommits([]);
//         setError(err.message);
//       } finally {
//         setLoadingCommits(false);
//       }
//     }
//     fetchCommits();
//   }, [debouncedOwner, debouncedRepo, selectedBranch]);

//   async function loadMoreCommits() {
//     if (!hasMoreCommits || loadingMoreCommits) return;

//     setLoadingMoreCommits(true);
//     let url = `http://localhost:4000/api/repos/${debouncedOwner}/${debouncedRepo}/commits?per_page=50&page=${commitPage}`;
//     if (selectedBranch && selectedBranch !== "all") {
//       url += `&sha=${selectedBranch}`;
//     }

//     try {
//       const res = await fetchWithRetry(url, {});

//       if (res.status === 403) throw new Error("API rate limit exceeded. Try again later.");
//       if (res.status === 401) throw new Error("Authentication failed.");
//       if (res.status === 404) throw new Error("No more commits found.");

//       const data = await res.json();
//       if (data.length === 0) {
//         setHasMoreCommits(false);
//       } else {
//         const formatted = data.map((c) => ({
//           hash: c.sha.substring(0, 7),
//           message: c.commit.message.split("\n")[0],
//           author: c.commit.author?.name || "Unknown",
//           date: new Date(c.commit.author.date).toLocaleDateString(),
//           parent: c.parents[0]?.sha?.substring(0, 7) || null,
//           branch: selectedBranch !== "all" ? selectedBranch : "",
//           activity: "medium",
//         }));

//         setCommits((prev) => [...prev, ...formatted]);
//         setCommitPage((prev) => prev + 1);
//         if (data.length < 50) setHasMoreCommits(false);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoadingMoreCommits(false);
//     }
//   }

//   // Fetch linked PRs and issues for selected commit
//   useEffect(() => {
//     async function fetchLinksForSelectedCommit() {
//       if (!selectedCommit) {
//         setLinkedPRs([]);
//         setLinkedIssues([]);
//         return;
//       }

//       try {
//         const commitData = commits.find((c) => c.hash === selectedCommit);
//         if (!commitData) {
//           setLinkedPRs([]);
//           setLinkedIssues([]);
//           return;
//         }
//         const prs = await getPullRequestsForCommit(
//           debouncedOwner,
//           debouncedRepo,
//           commitData.hash
//         );
//         setLinkedPRs(prs);

//         const issueNumbers = findReferencedIssuesInMessage(commitData.message);
//         const issuesPromises = issueNumbers.map((num) =>
//           getIssueDetails(debouncedOwner, debouncedRepo, num).catch(() => null)
//         );
//         const issues = (await Promise.all(issuesPromises)).filter(Boolean);
//         setLinkedIssues(issues);
//       } catch (error) {
//         console.error("Error fetching linked PRs/issues:", error);
//         setLinkedPRs([]);
//         setLinkedIssues([]);
//       }
//     }

//     fetchLinksForSelectedCommit();
//   }, [selectedCommit, commits, debouncedOwner, debouncedRepo]);

//   const selectedCommitData = selectedCommit ? commits.find((c) => c.hash === selectedCommit) : null;

//   return (
//     <div className="flex relative h-screen overflow-hidden">
//       {/* Sidebar */}
//       <div
//         className={`fixed md:static top-0 left-0 h-full w-72 bg-gray-900 text-white p-4 overflow-y-auto transition-transform duration-300 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
//         }`}
//         style={{ maxHeight: "100vh" }}
//       >
//         <h1 className="text-xl font-bold mb-4">Git Visualizer</h1>

//         {/* Repo URL input */}
//         <div className="mb-4">
//           <label className="block mb-1">Repository URL</label>
//           <input
//             type="text"
//             className="w-full p-2 rounded bg-gray-800 text-white"
//             placeholder="Paste GitHub repository URL (e.g., https://github.com/owner/repo)"
//             value={repoUrl}
//             onChange={handleRepoUrlChange}
//           />
//           {urlError && <p className="text-red-400 mt-1 text-sm">{urlError}</p>}
//         </div>

//         {/* Owner input */}
//         <div className="mb-4">
//           <label className="block mb-1">Owner</label>
//           <input
//             type="text"
//             className="w-full p-2 rounded bg-gray-800 text-white"
//             placeholder="GitHub Owner"
//             value={inputOwner}
//             onChange={(e) => setInputOwner(e.target.value)}
//           />
//         </div>

//         {/* Repository input */}
//         <div className="mb-4">
//           <label className="block mb-1">Repository</label>
//           <input
//             type="text"
//             className="w-full p-2 rounded bg-gray-800 text-white"
//             placeholder="Repository Name"
//             value={inputRepo}
//             onChange={(e) => setInputRepo(e.target.value)}
//           />
//         </div>

//         {/* Branch selector */}
//         <label className="block mb-2 mt-2 text-sm">Filter by Branch</label>
//         <select
//           className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
//           value={selectedBranch}
//           onChange={(e) => setSelectedBranch(e.target.value)}
//         >
//           {branches.map((branch) => (
//             <option key={branch} value={branch}>
//               {branch}
//             </option>
//           ))}
//         </select>

//         {/* Export buttons */}
//         <div className="mb-6 space-y-2">
//           <button
//             className="w-full py-2 bg-green-600 rounded text-white hover:bg-green-700"
//             onClick={() => downloadCsv(commits, "commit_history.csv")}
//           >
//             Export Commits CSV
//           </button>
//           <button
//             className="w-full py-2 bg-purple-600 rounded text-white hover:bg-purple-700"
//             onClick={() => downloadCsv(contributors, "contributors.csv")}
//           >
//             Export Contributors CSV
//           </button>
//           <button
//             className="w-full py-2 bg-blue-600 rounded text-white hover:bg-blue-700"
//             onClick={() =>
//               exportPdfReport("Commit History Report", commits, commitActivityChartRef, "commit_report.pdf")
//             }
//           >
//             Export Commits PDF
//           </button>
//         </div>

//         {loadingRepo && <p className="mt-4 text-gray-300">Loading repository info...</p>}

//         {repoInfo && (
//           <>
//             <DashboardSummary
//               totalCommits={commits.length}
//               totalContributors={contributors.length}
//               stars={repoInfo.stars}
//               forks={repoInfo.forks}
//               watchers={repoInfo.watchers}
//               openIssues={repoInfo.openIssues}
//             />
//             <div className="mt-4 space-y-4">
//               <div className="space-y-1 text-sm">
//                 <p>
//                   <strong>Repo:</strong>{" "}
//                   <a href={repoInfo.url} target="_blank" rel="noreferrer" className="underline hover:text-yellow-400">
//                     {repoInfo.name}
//                   </a>
//                 </p>
//                 <div>
//                   <strong>Languages:</strong>{" "}
//                   {Object.keys(repoInfo.languages).map((lang) => (
//                     <span key={lang} className="inline-block mr-2 px-2 rounded bg-gray-700">
//                       {lang}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               <div className="mt-4 mb-6">
//                 <LanguageChart ref={languageChartRef} languages={repoInfo.languages} />
//               </div>

//               <ContributorList contributors={contributors} />
//             </div>
//           </>
//         )}

//         {error && (
//           <div className="mt-4 p-2 bg-red-600 bg-opacity-75 rounded text-white font-semibold">
//             {error}
//             <button
//               onClick={() => {
//                 setError(null);
//                 setRepoInfo(null);
//                 setContributors([]);
//                 setCommits([]);
//                 setHasMoreCommits(true);
//                 setCommitPage(1);
//               }}
//               className="ml-4 underline cursor-pointer"
//             >
//               Retry
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6 overflow-auto bg-gray-100">
//         <CommitActivityChart ref={commitActivityChartRef} commits={commits} />

//         <h2 className="text-2xl font-bold mb-6">Commit Visualization</h2>

//         {loadingCommits && (
//           <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
//             <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
//           </div>
//         )}

//         {commits.length > 0 ? (
//           <>
//             <ReactFlowProvider>
//               <BranchTree
//                 commits={commits}
//                 hoveredCommit={hoveredCommit}
//                 selectedCommit={selectedCommit}
//                 selectedBranch={selectedBranch}
//                 onHover={setHoveredCommit}
//                 onSelect={setSelectedCommit}
//               />
//             </ReactFlowProvider>

//             <CommitList
//               commits={commits}
//               hoveredCommit={hoveredCommit}
//               selectedCommit={selectedCommit}
//               selectedBranch={selectedBranch}
//               onClick={setSelectedCommit}
//               onHover={setHoveredCommit}
//             />

//             {hasMoreCommits && (
//               <div className="mt-4 text-center">
//                 <button
//                   className="rounded px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
//                   onClick={loadMoreCommits}
//                   disabled={loadingMoreCommits}
//                 >
//                   {loadingMoreCommits ? "Loading..." : "Load More Commits"}
//                 </button>
//               </div>
//             )}
//           </>
//         ) : (
//           !loadingCommits && <p className="text-gray-600">No commits found.</p>
//         )}
//       </div>

//       {/* Commit Details Panel */}
//       <CommitDetailsPanel
//         commit={selectedCommitData}
//         linkedPRs={linkedPRs}
//         linkedIssues={linkedIssues}
//         onClose={() => setSelectedCommit(null)}
//         prStatusFilter={prStatusFilter}
//         setPrStatusFilter={setPrStatusFilter}
//       />
//     </div>
//   );
// }

// export default App;



