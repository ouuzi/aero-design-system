/*
 * The page numbers Pagination shows. Plain data, kept apart from the component so it can be
 * tested without a DOM.
 */

/** Page numbers to show, with 'gap' where pages are left out. Seven or fewer pages: all of them. */
export function pageWindow(page: number, pageCount: number): Array<number | 'gap'> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const from = Math.max(2, Math.min(page - 1, pageCount - 4));
  const to = Math.min(pageCount - 1, Math.max(page + 1, 5));
  const pages: Array<number | 'gap'> = [1];
  if (from > 2) pages.push('gap');
  for (let p = from; p <= to; p++) pages.push(p);
  if (to < pageCount - 1) pages.push('gap');
  pages.push(pageCount);
  return pages;
}
