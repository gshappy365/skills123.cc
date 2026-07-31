const EXTENDED_ARRAY_FIELDS = ["requirements", "outputs", "usageExamples", "safetyNotes"];

function assert(condition, message) {
  if (!condition) throw new TypeError(`Invalid catalogue: ${message}`);
}

function assertUniqueIds(items, label) {
  const ids = new Set();
  for (const item of items) {
    assert(item?.id, `${label} is missing an id`);
    assert(!ids.has(item.id), `duplicate ${label} id "${item.id}"`);
    ids.add(item.id);
  }
}

function validateExtendedFields(skill) {
  for (const field of EXTENDED_ARRAY_FIELDS) {
    if (skill[field] === undefined) continue;
    assert(
      Array.isArray(skill[field]) && skill[field].every((item) => typeof item === "string"),
      `skill "${skill.id}" has an invalid ${field}`
    );
  }
  if (skill.environmentVariables !== undefined) {
    assert(Array.isArray(skill.environmentVariables), `skill "${skill.id}" has invalid environmentVariables`);
    for (const variable of skill.environmentVariables) {
      assert(
        variable && typeof variable.name === "string" && typeof variable.description === "string",
        `skill "${skill.id}" has an invalid environment variable`
      );
    }
  }
  if (skill.installCommand !== undefined) {
    assert(
      typeof skill.installCommand === "string" && skill.installCommand.startsWith("/plugin install "),
      `skill "${skill.id}" has an invalid installCommand`
    );
    for (const field of [
      "platform",
      "requirements",
      "environmentVariables",
      "outputs",
      "usageExamples",
      "license",
      "sourceUrl",
      "upstreamVersion",
      "upstreamCommit",
    ]) {
      assert(skill[field] !== undefined, `skill "${skill.id}" is missing ${field}`);
    }
  }
  if (skill.sourceUrl !== undefined) {
    assert(/^https:\/\//.test(skill.sourceUrl), `skill "${skill.id}" has an invalid sourceUrl`);
  }
  if (skill.upstreamCommit !== undefined) {
    assert(/^[a-f0-9]{40}$/.test(skill.upstreamCommit), `skill "${skill.id}" has an invalid upstreamCommit`);
  }
  if (skill.license !== undefined) {
    assert(
      ["MIT", "Apache-2.0", "CC BY-NC 4.0", "unconfirmed"].includes(skill.license),
      `skill "${skill.id}" has an invalid license`
    );
  }
}

function validateCatalogShell(catalog) {
  assert(Array.isArray(catalog?.scenarios), "scenarios must be an array");
  assert(Array.isArray(catalog?.packages), "packages must be an array");
  assertUniqueIds(catalog.scenarios, "scenario");
  assertUniqueIds(catalog.packages, "package");
  const scenarioIds = new Set(catalog.scenarios.map((scenario) => scenario.id));
  for (const pkg of catalog.packages) {
    assert(scenarioIds.has(pkg.scenario), `package "${pkg.id}" has unknown scenario "${pkg.scenario}"`);
    assert(pkg.workspace?.skillsUrl, `package "${pkg.id}" is missing workspace.skillsUrl`);
    if (pkg.installCommand !== undefined) {
      assert(
        typeof pkg.installCommand === "string" &&
          (pkg.installCommand.startsWith("npx -y skills add ") ||
            pkg.installCommand.startsWith("npx wigolo init ") ||
            pkg.installCommand.startsWith("bunx skills add ") ||
            pkg.installCommand.startsWith("codex plugin marketplace add ") ||
            pkg.installCommand.startsWith("claude plugin marketplace add ")),
        `package "${pkg.id}" has an invalid installCommand`
      );
    }
    if (pkg.license !== undefined) {
      assert(
        ["MIT", "Apache-2.0", "CC BY-NC 4.0", "unconfirmed"].includes(pkg.license),
        `package "${pkg.id}" has an invalid license`
      );
    }
    if (pkg.source?.commit !== undefined) {
      assert(/^[a-f0-9]{40}$/.test(pkg.source.commit), `package "${pkg.id}" has an invalid source commit`);
    }
  }
}

function labelsFor(pkg) {
  return {
    groups: pkg.workspace.groupLabels ?? {},
    lifecycles: pkg.workspace.lifecycleLabels ?? {},
    invocationModes: pkg.workspace.invocationModeLabels ?? {},
  };
}

function validateSkills(pkg, skills, labels) {
  assert(Array.isArray(skills), `package "${pkg.id}" skills must be an array`);
  assertUniqueIds(skills, `skill in package "${pkg.id}"`);
  assert(
    pkg.skillCount === skills.length,
    `package "${pkg.id}" declares ${pkg.skillCount} skills but loads ${skills.length}`
  );
  for (const skill of skills) {
    assert(labels.groups[skill.group], `skill "${skill.id}" has unknown group "${skill.group}"`);
    assert(labels.lifecycles[skill.lifecycle], `skill "${skill.id}" has unknown lifecycle "${skill.lifecycle}"`);
    assert(
      labels.invocationModes[skill.invocationMode],
      `skill "${skill.id}" has unknown invocation mode "${skill.invocationMode}"`
    );
    validateExtendedFields(skill);
  }
}

export async function createPackageWorkspaceModel(catalog, packageId, fetchJson) {
  validateCatalogShell(catalog);
  const pkg = catalog.packages.find((item) => item.id === packageId);
  assert(pkg, `unknown package "${packageId}"`);
  const loadedSkills = await fetchJson(pkg.workspace.skillsUrl);
  const skills = [...loadedSkills];
  if (pkg.featuredSkill && !skills.some((skill) => skill.id === pkg.featuredSkill.id)) {
    skills.push(pkg.featuredSkill);
  }
  const labels = labelsFor(pkg);
  if (pkg.groups !== undefined) {
    assert(
      JSON.stringify(pkg.groups) === JSON.stringify(Object.values(labels.groups)),
      `package "${pkg.id}" groups do not match workspace.groupLabels`
    );
  }
  validateSkills(pkg, skills, labels);
  return { package: pkg, skills, labels };
}

export async function createCatalogueModel(catalog, fetchJson) {
  validateCatalogShell(catalog);
  const workspaces = await Promise.all(
    catalog.packages.map((pkg) => createPackageWorkspaceModel(catalog, pkg.id, fetchJson))
  );
  return {
    catalog,
    packageSkills: Object.fromEntries(
      workspaces.map((workspace) => [workspace.package.id, workspace.skills])
    ),
  };
}

export function getPackageWorkspaceModel(model, packageId) {
  const pkg = model.catalog.packages.find((item) => item.id === packageId);
  assert(pkg, `unknown package "${packageId}"`);
  const skills = model.packageSkills[packageId];
  assert(skills, `package "${packageId}" skills are not loaded`);
  return { package: pkg, skills, labels: labelsFor(pkg) };
}
