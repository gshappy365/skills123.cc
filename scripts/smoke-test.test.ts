import { describe, it, expect } from 'vitest';
import yaml from 'js-yaml';
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.resolve(__dirname, '../src/data');
const VALID_CATEGORIES = ['agent', 'terminal', 'skills', 'governance'];
const VALID_DIMENSION_IDS = ['community', 'engineering', 'model_compat', 'security', 'ux', 'ecosystem'];

function loadYaml<T>(filePath: string): T {
  return yaml.load(fs.readFileSync(filePath, 'utf-8')) as T;
}

describe('projects.yaml', () => {
  const data = loadYaml<{ projects: any[] }>(path.resolve(DATA_DIR, 'projects.yaml'));
  const requiredFields = ['id', 'name', 'category', 'repo', 'description', 'scores', 'communityData', 'tags'];
  const requiredCommunityFields = ['stars', 'forks', 'contributors', 'openIssues', 'lastCommit'];

  it('should have a projects array with at least 1 project', () => {
    expect(data.projects).toBeInstanceOf(Array);
    expect(data.projects.length).toBeGreaterThanOrEqual(1);
  });

  data.projects.forEach((p, i) => {
    const label = `project[${i}] (${p.id || 'unknown'})`;

    it(`${label} should have all required fields`, () => {
      for (const field of requiredFields) {
        expect(p[field]).toBeDefined();
      }
    });

    it(`${label} should have valid category`, () => {
      expect(VALID_CATEGORIES).toContain(p.category);
    });

    it(`${label} scores should be 0-100 or null`, () => {
      for (const dim of VALID_DIMENSION_IDS) {
        if (p.scores[dim] !== undefined && p.scores[dim] !== null) {
          expect(typeof p.scores[dim]).toBe('number');
          expect(p.scores[dim]).toBeGreaterThanOrEqual(0);
          expect(p.scores[dim]).toBeLessThanOrEqual(100);
        }
      }
    });

    it(`${label} communityData should have all required fields`, () => {
      for (const field of requiredCommunityFields) {
        expect(p.communityData[field]).toBeDefined();
      }
    });

    it(`${label} tags should be an array`, () => {
      expect(Array.isArray(p.tags)).toBe(true);
    });

    if (p.milestones) {
      it(`${label} milestones should be an array`, () => {
        expect(Array.isArray(p.milestones)).toBe(true);
      });
    }
  });
});

describe('dimensions.yaml', () => {
  const data = loadYaml<{ dimensions: any[] }>(path.resolve(DATA_DIR, 'dimensions.yaml'));
  const requiredFields = ['id', 'name', 'weight', 'icon', 'description', 'subMetrics'];

  it('should have a dimensions array with at least 1 dimension', () => {
    expect(data.dimensions).toBeInstanceOf(Array);
    expect(data.dimensions.length).toBeGreaterThanOrEqual(1);
  });

  data.dimensions.forEach((d, i) => {
    const label = `dimension[${i}] (${d.id || 'unknown'})`;

    it(`${label} should have all required fields`, () => {
      for (const field of requiredFields) {
        expect(d[field]).toBeDefined();
      }
    });

    it(`${label} weight should be 1-100`, () => {
      expect(typeof d.weight).toBe('number');
      expect(d.weight).toBeGreaterThan(0);
      expect(d.weight).toBeLessThanOrEqual(100);
    });

    it(`${label} subMetrics should be valid`, () => {
      expect(Array.isArray(d.subMetrics)).toBe(true);
      for (const sm of d.subMetrics) {
        expect(sm.name).toBeDefined();
        expect(sm.source).toBeDefined();
      }
    });

    if (d.applicableCategories) {
      it(`${label} applicableCategories should be valid`, () => {
        expect(Array.isArray(d.applicableCategories)).toBe(true);
        for (const cat of d.applicableCategories) {
          expect(VALID_CATEGORIES).toContain(cat);
        }
      });
    }
  });
});
