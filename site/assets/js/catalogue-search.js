import { createCatalogueModel } from "./catalogue-model.js?v=20260726-3";

export const PACKAGE_GROUP_ORDER = Object.freeze([
  "development",
  "research",
  "content",
  "operations",
]);

function normalizedText(values) {
  return values
    .flat(Infinity)
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();
}

function packageHref(packageId, skillId = null) {
  const base = `/packages/${encodeURIComponent(packageId)}/`;
  return skillId ? `${base}?skill=${encodeURIComponent(skillId)}` : base;
}

export function buildPackageGroups(catalog) {
  const scenarioById = new Map(
    catalog.scenarios.map((scenario) => [scenario.id, scenario])
  );

  return PACKAGE_GROUP_ORDER.map((id) => {
    const scenario = scenarioById.get(id);
    return {
      ...scenario,
      id,
      status: scenario?.status ?? "coming-soon",
      packages: catalog.packages.filter((item) => item.scenario === id),
    };
  });
}

export async function loadPackageSkills(catalog, fetchJson) {
  return (await createCatalogueModel(catalog, fetchJson)).packageSkills;
}

export function searchCatalogue({ catalog, packageSkills, guides = [], query }) {
  const normalizedQuery = String(query).trim().toLocaleLowerCase();
  if (!normalizedQuery) {
    return { packageMatches: [], skillMatches: [], guideMatches: [] };
  }

  const scenarioById = new Map(
    catalog.scenarios.map((scenario) => [scenario.id, scenario])
  );
  const packageMatches = catalog.packages
    .filter((pkg) =>
      normalizedText([
        pkg.name,
        pkg.description,
        pkg.tags,
        scenarioById.get(pkg.scenario)?.name,
      ]).includes(normalizedQuery)
    )
    .map((pkg) => ({ ...pkg, href: packageHref(pkg.id) }));

  const skillMatches = catalog.packages.flatMap((pkg) =>
    (packageSkills[pkg.id] ?? [])
      .filter((skill) =>
        normalizedText([
          skill.id,
          skill.name,
          skill.command,
          skill.description,
          skill.descriptionZh,
          skill.descriptionEn,
          skill.tags,
          pkg.workspace?.groupLabels?.[skill.group],
          skill.requirements,
          skill.outputs,
          skill.environmentVariables?.map((variable) => [variable.name, variable.description]),
        ]).includes(normalizedQuery)
      )
      .map((skill) => ({
        ...skill,
        package: {
          id: pkg.id,
          name: pkg.name,
          scenario: pkg.scenario,
        },
        href: packageHref(pkg.id, skill.id),
      }))
  );

  const guideMatches = guides
    .filter((guide) =>
      normalizedText([
        guide.name,
        guide.description,
        guide.label,
        guide.tags,
      ]).includes(normalizedQuery)
    )
    .map(({ id, name, description, label, articleCount, topicCount, href }) => ({
      id,
      name,
      description,
      label,
      articleCount,
      topicCount,
      href,
    }));

  return { packageMatches, skillMatches, guideMatches };
}
