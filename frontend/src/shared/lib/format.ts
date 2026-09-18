// Number and date formatting used across the dashboard.
const hectareFormat = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1 });
const countFormat = new Intl.NumberFormat('en-IN');
const dateFormat = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
const monthFormat = new Intl.DateTimeFormat('en-IN', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatHectares(hectares: number): string {
  return `${hectareFormat.format(hectares)} ha`;
}

export function formatCount(count: number): string {
  return countFormat.format(count);
}

export function formatDate(isoDate: string): string {
  return dateFormat.format(new Date(isoDate));
}

export function formatMonth(isoDate: string): string {
  return monthFormat.format(new Date(isoDate));
}
