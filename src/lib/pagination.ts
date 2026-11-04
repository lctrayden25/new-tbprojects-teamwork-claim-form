export const PAGE_SIZES = [10, 20, 50] as const;
export const DEFAULT_PAGE_SIZE = PAGE_SIZES[0];
export type PageSize = (typeof PAGE_SIZES)[number];

export function isPageSize(value: number): value is PageSize {
	return (PAGE_SIZES as readonly number[]).includes(value);
}
