/**
 * Smoke test for harness-eval data integrity.
 * Validates that all YAML data files parse correctly and required fields exist.
 * Run: npm test (or: node scripts/smoke-test.mjs)
 */
import yaml from 'js-yaml';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../src/data');

const VALID_CATEGORIES = ['agent', 'terminal', 'skills', 'governance'];
const VALID_DIMENSION_IDS = ['community', 'engineering', 'model_compat', 'security', 'ux', 'ecosystem'];

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`  FAIL: ${message}`);
  }
}

// Load projects.yaml
console.log('Validating projects.yaml...');
const projectsRaw = fs.readFileSync(path.resolve(DATA_DIR, 'projects.yaml'), 'utf-8');
const projectsData = yaml.load(projectsRaw);
assert(projectsData && Array.isArray(projectsData.projects), 'projects.yaml should have a "projects" array');
assert(projectsData.projects.length >= 1, 'projects.yaml should have at least 1 project');

const requiredProjectFields = ['id', 'name', 'category', 'repo', 'description', 'scores', 'communityData', 'tags'];
const requiredCommunityFields = ['stars', 'forks', 'contributors', 'openIssues', 'lastCommit'];

for (let i = 0; i < projectsData.projects.length; i++) {
  const p = projectsData.projects[i];
  const label = `project[${i}] (${p.id || 'unknown'})`;

  for (const field of requiredProjectFields) {
    assert(p[field] !== undefined && p[field] !== null, `${label} should have field "${field}"`);
  }

  if (p.category) {
    assert(VALID_CATEGORIES.includes(p.category), `${label} category "${p.category}" should be one of ${VALID_CATEGORIES.join(', ')}`);
  }

  if (p.scores) {
    for (const dim of VALID_DIMENSION_IDS) {
      // null scores are valid (dimension not applicable)
      if (p.scores[dim] !== undefined && p.scores[dim] !== null) {
        assert(typeof p.scores[dim] === 'number' && p.scores[dim] >= 0 && p.scores[dim] <= 100,
          `${label} score "${dim}" should be 0-100, got ${p.scores[dim]}`);
      }
    }
  }

  if (p.communityData) {
    for (const field of requiredCommunityFields) {
      assert(p.communityData[field] !== undefined, `${label} communityData should have field "${field}"`);
    }
  }

  if (p.tags) {
    assert(Array.isArray(p.tags), `${label} tags should be an array`);
  }

  if (p.milestones) {
    assert(Array.isArray(p.milestones), `${label} milestones should be an array`);
  }
}

// Load dimensions.yaml
console.log('Validating dimensions.yaml...');
const dimsRaw = fs.readFileSync(path.resolve(DATA_DIR, 'dimensions.yaml'), 'utf-8');
const dimsData = yaml.load(dimsRaw);
assert(dimsData && Array.isArray(dimsData.dimensions), 'dimensions.yaml should have a "dimensions" array');
assert(dimsData.dimensions.length >= 1, 'dimensions.yaml should have at least 1 dimension');

const requiredDimFields = ['id', 'name', 'weight', 'icon', 'description', 'subMetrics'];
for (let i = 0; i < dimsData.dimensions.length; i++) {
  const d = dimsData.dimensions[i];
  const label = `dimension[${i}] (${d.id || 'unknown'})`;

  for (const field of requiredDimFields) {
    assert(d[field] !== undefined && d[field] !== null, `${label} should have field "${field}"`);
  }

  assert(typeof d.weight === 'number' && d.weight > 0 && d.weight <= 100, `${label} weight should be 1-100`);

  if (d.subMetrics) {
    assert(Array.isArray(d.subMetrics), `${label} subMetrics should be an array`);
    for (const sm of d.subMetrics) {
      assert(sm.name, `${label} subMetric should have a "name"`);
      assert(sm.source, `${label} subMetric should have a "source"`);
    }
  }

  if (d.applicableCategories) {
    assert(Array.isArray(d.applicableCategories), `${label} applicableCategories should be an array`);
    for (const cat of d.applicableCategories) {
      assert(VALID_CATEGORIES.includes(cat), `${label} applicableCategory "${cat}" should be valid`);
    }
  }
}

// Summary
console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
