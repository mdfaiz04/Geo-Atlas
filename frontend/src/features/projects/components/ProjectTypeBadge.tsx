// Coloured label that matches a project type to its map colour.
import { PROJECT_TYPE_COLORS, PROJECT_TYPE_LABELS } from '@/shared/domain/projectType';
import type { ProjectType } from '@/shared/domain/projectType';
import { Badge } from '@/shared/ui/Badge';

export function ProjectTypeBadge({ type }: { type: ProjectType }) {
  return <Badge color={PROJECT_TYPE_COLORS[type]}>{PROJECT_TYPE_LABELS[type]}</Badge>;
}
