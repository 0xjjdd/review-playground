/** Page `page` (1-based) of `items`, `perPage` at a time. */
export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

/** How many pages `total` items fill (a partial last page counts). */
export function pageCount(total: number, perPage: number): number {
  return Math.ceil(total / perPage);
}
