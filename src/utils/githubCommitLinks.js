const GITHUB_API_BASE = "https://api.github.com";

/**
 * Fetch pull requests that contain the given commit SHA.
 * Requires special accept header for preview API.
 * 
 * @param {string} owner - repo owner
 * @param {string} repo - repo name
 * @param {string} sha - commit SHA
 * @param {string} token - GitHub access token
 * @returns {Promise<Array>} - arra y of PR objects
 */
export async function getPullRequestsForCommit(owner, repo, sha, token) {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits/${sha}/pulls`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.groot-preview+json",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch PRs for commit: ${res.status}`);
  }
  const prs = await res.json();
  return prs;
}

/**
 * Parse referenced issue numbers from commit message.
 * Looks for keywords like fixes #123, closes #456 etc.
 * 
 * @param {string} message - commit message text
 * @returns {Array<number>} - array of issue numbers referenced
 */
export function findReferencedIssuesInMessage(message) {
  const issueNumbers = [];
  const regex = /\b(?:fixes|closes|resolves)\s+#(\d+)/gi;
  let match;
  while ((match = regex.exec(message)) !== null) {
    issueNumbers.push(parseInt(match[1], 10));
  }
  return issueNumbers;
}

/**
 * Fetch detailed information for a single issue.
 * 
 * @param {string} owner    - repo owner
 * @param {string} repo - repo name
 * @param {number} issueNumber - issue number
 * @param {string} token - GitHub access token
 * @returns {Promise<Object>} - issue object
 */
export async function getIssueDetails(owner, repo, issueNumber, token) {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues/${issueNumber}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch issue #${issueNumber}: ${res.status}`);
  }
  return res.json();
}
