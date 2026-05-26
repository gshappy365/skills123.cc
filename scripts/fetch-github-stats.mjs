/**
 * Fetch latest GitHub stats for all projects and update projects.yaml.
 * Run: node scripts/fetch-github-stats.mjs
 * Requires GITHUB_TOKEN env var for higher API rate limit.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const YAML_PATH = path.resolve(__dirname, '../src/data/projects.yaml');

// Minimal YAML parser/writer to avoid js-yaml dependency in scripts
function parseYaml(raw) {
  const projects = [];
  let current = null;
  let inCommunityData = false;
  let inMilestones = false;
  let inScores = false;

  for (const line of raw.split('\n')) {
    if (line.startsWith('  - id: ')) {
      if (current) projects.push(current);
      current = { tags: [], milestones: [], scores: {}, communityData: {} };
      current.id = line.split(': ')[1];
      inCommunityData = false;
      inMilestones = false;
      inScores = false;
    } else if (current) {
      if (line.trim() === 'communityData:') {
        inCommunityData = true;
        inMilestones = false;
        inScores = false;
      } else if (line.trim() === 'milestones:') {
        inMilestones = true;
        inCommunityData = false;
        inScores = false;
      } else if (line.trim() === 'scores:') {
        inScores = true;
        inCommunityData = false;
        inMilestones = false;
      } else if (inCommunityData && line.match(/^\s{6}\w/)) {
        const [k, v] = line.trim().split(': ');
        if (k && v !== undefined) {
          current.communityData[k] = isNaN(Number(v)) ? v : Number(v);
        }
      }
    }
  }
  if (current) projects.push(current);
  return projects;
}

function repoFromUrl(url) {
  const m = url.match(/github\.com\/([^/]+\/[^/]+?)(?:\.git|$)/);
  return m ? m[1] : null;
}

async function fetchRepoData(repo) {
  const headers = { Accept: 'application/vnd.github.v3+json' };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
  if (!res.ok) {
    console.error(`Failed to fetch ${repo}: ${res.status}`);
    return null;
  }

  return await res.json();
}

async function fetchContributorsCount(repo) {
  const headers = { Accept: 'application/vnd.github.v3+json' };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  // Use per_page=1 and parse Link header for last page number = total count
  const res = await fetch(`https://api.github.com/repos/${repo}/contributors?per_page=1&anon=true`, { headers });
  if (!res.ok) {
    console.warn(`  Failed to fetch contributors for ${repo}: ${res.status}, falling back to 0`);
    return 0;
  }

  const link = res.headers.get('link');
  if (!link) {
    // Only 1 page or no contributors — count the response body
    const body = await res.json();
    return Array.isArray(body) ? body.length : 0;
  }

  const match = link.match(/page=(\d+)>; rel="last"/);
  if (match) {
    return parseInt(match[1], 10);
  }

  return 0;
}

async function fetchStats(repo) {
  const data = await fetchRepoData(repo);
  if (!data) return null;

  const contributors = await fetchContributorsCount(repo);

  return {
    stars: data.stargazers_count,
    forks: data.forks_count,
    contributors,
    openIssues: data.open_issues_count,
    lastCommit: data.pushed_at ? data.pushed_at.split('T')[0] : 'unknown',
  };
}

function updateYaml(raw, id, stats) {
  const lines = raw.split('\n');
  let inTarget = false;
  let inCommunityData = false;
  const result = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    result.push(line);

    if (line.startsWith('  - id: ') && line.includes(id)) {
      inTarget = true;
    } else if (line.startsWith('  - id: ') && !line.includes(id)) {
      inTarget = false;
    }

    if (inTarget && line.trim() === 'communityData:') {
      inCommunityData = true;
      // Skip existing communityData lines
      while (i + 1 < lines.length && lines[i + 1].match(/^\s{6}\w/)) {
        i++;
      }
      // Insert new data
      result.push(`    stars: ${stats.stars}`);
      result.push(`    forks: ${stats.forks}`);
      result.push(`    contributors: ${stats.contributors}`);
      result.push(`    openIssues: ${stats.openIssues}`);
      result.push(`    lastCommit: "${stats.lastCommit}"`);
      inCommunityData = false;
    }
  }

  return result.join('\n');
}

async function main() {
  const raw = fs.readFileSync(YAML_PATH, 'utf-8');
  const projects = parseYaml(raw);
  let updated = raw;

  for (const p of projects) {
    const repo = repoFromUrl(p.url || `https://github.com/${p.id.replace('-', '/')}`);
    // Try to find repo from the YAML by reading the raw lines
  }

  // More robust: read repo URLs from the file
  const repoPattern = /repo: https:\/\/github\.com\/([^\s]+)/g;
  let match;
  const repos = [];
  while ((match = repoPattern.exec(raw)) !== null) {
    repos.push(match[1]);
  }

  for (const repo of repos) {
    console.log(`Fetching stats for ${repo}...`);
    const stats = await fetchStats(repo);
    if (stats) {
      // Find the project id by looking backwards from the repo line
      const lines = updated.split('\n');
      let repoLineIdx = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(repo)) {
          repoLineIdx = i;
          break;
        }
      }
      if (repoLineIdx >= 0) {
        for (let j = repoLineIdx; j >= 0; j--) {
          const m = lines[j].match(/  - id: (.+)/);
          if (m) {
            updated = updateYaml(updated, m[1], stats);
            console.log(`  Updated ${m[1]}: ${stats.stars} stars, ${stats.forks} forks`);
            break;
          }
        }
      }
    }
  }

  fs.writeFileSync(YAML_PATH, updated, 'utf-8');
  console.log('\nDone!');
}

main().catch(console.error);
