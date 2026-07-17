const DEFAULT_FILTERS = Object.freeze({ groups: [], lifecycles: [] });

export function getSelectedSkillIdFromUrl(url) {
  return new URL(url, "https://skills123.invalid").searchParams.get("skill");
}

export function createSelectedSkillUrl(url, selectedSkillId) {
  const nextUrl = new URL(url, "https://skills123.invalid");
  if (selectedSkillId) nextUrl.searchParams.set("skill", selectedSkillId);
  else nextUrl.searchParams.delete("skill");
  return nextUrl.href;
}

function uniqueStrings(values) {
  return [...new Set((Array.isArray(values) ? values : []).filter(Boolean))];
}

function normalizeFilters(filters = DEFAULT_FILTERS) {
  return {
    groups: uniqueStrings(filters.groups),
    lifecycles: uniqueStrings(filters.lifecycles),
  };
}

function matchesQuery(skill, normalizedQuery) {
  if (!normalizedQuery) return true;

  return [
    skill.id,
    skill.name,
    skill.command,
    skill.descriptionZh,
    skill.descriptionEn,
    ...(skill.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase()
    .includes(normalizedQuery);
}

function matchesFilters(skill, filters) {
  const matchesGroup =
    filters.groups.length === 0 || filters.groups.includes(skill.group);
  const matchesLifecycle =
    filters.lifecycles.length === 0 || filters.lifecycles.includes(skill.lifecycle);

  return matchesGroup && matchesLifecycle;
}

function labelFor(labels, facet, value) {
  return labels?.[facet]?.[value] ?? value;
}

function createDetail(skill, skills, labels) {
  if (!skill) return null;

  const relatedSkillIds = skills
    .filter((candidate) => candidate.group === skill.group && candidate.id !== skill.id)
    .slice(0, 3)
    .map((candidate) => candidate.id);

  return {
    id: skill.id,
    name: skill.name ?? skill.id,
    summary: skill.descriptionZh ?? skill.descriptionEn ?? "",
    command: skill.command,
    group: skill.group,
    groupLabel: labelFor(labels, "groups", skill.group),
    lifecycle: skill.lifecycle,
    lifecycleLabel: labelFor(labels, "lifecycles", skill.lifecycle),
    invocationMode: skill.invocationMode,
    invocationModeLabel: labelFor(labels, "invocationModes", skill.invocationMode),
    tags: uniqueStrings([
      labelFor(labels, "groups", skill.group),
      labelFor(labels, "lifecycles", skill.lifecycle),
      labelFor(labels, "invocationModes", skill.invocationMode),
      ...(skill.tags ?? []),
    ]),
    readingUrl: skill.readingUrl ?? null,
    relationships: (skill.relationships ?? []).map(({ type, label }) => ({
      type,
      label,
    })),
    relatedSkillIds,
  };
}

export function derivePackageWorkspaceState({
  packageId,
  skills = [],
  query = "",
  filters,
  selectedSkillId = null,
  reading = false,
  directoryPosition = 0,
  labels = {},
}) {
  if (!packageId) throw new TypeError("packageId is required");

  const normalizedQuery = String(query).trim().toLocaleLowerCase();
  const normalizedFilters = normalizeFilters(filters);
  const visibleSkills = skills.filter(
    (skill) =>
      matchesQuery(skill, normalizedQuery) && matchesFilters(skill, normalizedFilters)
  );
  const selectedSkill =
    visibleSkills.find((skill) => skill.id === selectedSkillId) ??
    visibleSkills[0] ??
    null;
  const selectedDetail = createDetail(selectedSkill, skills, labels);

  return {
    packageId,
    query: String(query),
    filters: normalizedFilters,
    visibleSkills,
    selectedSkill,
    selectedDetail,
    navigation: {
      packageId,
      query: String(query),
      filters: normalizedFilters,
      selectedSkillId: selectedSkill?.id ?? null,
      reading: Boolean(reading),
      directoryPosition:
        Number.isFinite(directoryPosition) && directoryPosition > 0
          ? directoryPosition
          : 0,
    },
  };
}
