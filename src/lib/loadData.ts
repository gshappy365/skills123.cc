import yaml from 'js-yaml';
import fs from 'node:fs';
import path from 'node:path';

export interface CommunityData {
  stars: number;
  forks: number;
  contributors: number;
  openIssues: number;
  lastCommit: string;
}

export interface Milestone {
  date: string;
  title: string;
  description: string;
}

export interface ProjectAnalysis {
  strengths: string;
  weaknesses: string;
  positioning: string;
  audience: string;
}

export interface Project {
  id: string;
  name: string;
  category: 'agent' | 'terminal' | 'skills' | 'governance';
  repo: string;
  website?: string;
  description: string;
  scores: Record<string, number | null>;
  communityData: CommunityData;
  tags: string[];
  milestones: Milestone[];
  analysis?: ProjectAnalysis;
}

export interface SubMetric {
  name: string;
  source: string;
}

export interface Dimension {
  id: string;
  name: string;
  weight: number;
  icon: string;
  description: string;
  subMetrics: SubMetric[];
  applicableCategories?: string[];
}

export interface ProjectsData {
  projects: Project[];
}

export interface DimensionsData {
  dimensions: Dimension[];
}

function loadYaml<T>(relativePath: string): T {
  const filePath = path.resolve(process.cwd(), relativePath);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(raw) as T;
}

export function loadProjects(): Project[] {
  const data = loadYaml<ProjectsData>('src/data/projects.yaml');
  return data.projects;
}

export function loadDimensions(): Dimension[] {
  const data = loadYaml<DimensionsData>('src/data/dimensions.yaml');
  return data.dimensions;
}

export function getProjectById(id: string): Project | undefined {
  return loadProjects().find((p) => p.id === id);
}

export function getApplicableDimensions(project: Project): Dimension[] {
  const dimensions = loadDimensions();
  if (!project.category) return dimensions;
  return dimensions.filter(
    (d) =>
      !d.applicableCategories || d.applicableCategories.includes(project.category)
  );
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    agent: 'Coding Agent',
    terminal: '终端',
    skills: '技能集',
    governance: '治理层',
  };
  return labels[category] || category;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    agent: 'bg-blue-100 text-blue-800',
    terminal: 'bg-purple-100 text-purple-800',
    skills: 'bg-green-100 text-green-800',
    governance: 'bg-orange-100 text-orange-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
}
