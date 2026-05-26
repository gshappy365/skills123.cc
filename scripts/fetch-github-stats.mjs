/**
 * Fetch latest GitHub stats for all projects and update projects.yaml.
 * Run: node scripts/fetch-github-stats.mjs
 * Requires GITHUB_TOKEN env var for higher API rate limit.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const YAML_PATH = path.resolve(__dirname, '../src/data/projects.yaml');

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

async function main() {
  const raw = fs.readFileSync(YAML_PATH, 'utf-8');
  const data = yaml.load(raw);
  const projects = data.projects;
  let updated = false;

  for (const project of projects) {
    const repo = repoFromUrl(project.repo);
    if (!repo) {
      console.warn(`  No GitHub repo found for ${project.name}, skipping`);
      continue;
    }

    console.log(`Fetching stats for ${repo}...`);
    const stats = await fetchStats(repo);
    if (stats) {
      project.communityData = stats;
      updated = true;
      console.log(`  Updated ${project.name}: ${stats.stars} stars, ${stats.forks} forks`);
    }
  }

  if (updated) {
    const output = yaml.dump(data, { lineWidth: -1, noCompatMode: true, quotingType: '"', forceQuotes: false });
    fs.writeFileSync(YAML_PATH, output, 'utf-8');
    console.log('\nYAML file updated successfully.');
  } else {
    console.log('\nNo updates made.');
  }
}

main().catch(console.error);
