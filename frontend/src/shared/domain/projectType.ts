// The two kinds of project the platform tracks, with their labels and map colours.
export const PROJECT_TYPES = ['carbon', 'biodiversity'] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  carbon: 'Carbon',
  biodiversity: 'Biodiversity',
};

export const PROJECT_TYPE_COLORS: Record<ProjectType, string> = {
  carbon: '#f2b134',
  biodiversity: '#3ecf8e',
};
