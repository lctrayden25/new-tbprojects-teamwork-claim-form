import { Claim } from '#lib/server/models/claims.ts';
import { ClaimStatus } from '#lib/constants.ts';
import { DEFAULT_PAGE_SIZE, isPageSize } from '#lib/pagination.ts';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { User as UserType } from '#lib/type/User.ts';
import { UserRole } from '#lib/constants.ts';

function parsePositiveInt(value: string | null) {
	if (value == null || !/^\d+$/.test(value)) return null;
	const parsed = Number(value);
	return Number.isSafeInteger(parsed) && parsed >= 1 ? parsed : null;
}

export const load = (async ({ locals, url }) => {
	const pageParam = url.searchParams.get('page');
	const limitParam = url.searchParams.get('limit');
	const parsedPage = parsePositiveInt(pageParam);
	const parsedLimit = parsePositiveInt(limitParam);
	const limit = parsedLimit != null && isPageSize(parsedLimit) ? parsedLimit : DEFAULT_PAGE_SIZE;

	const userId = locals.user?.id;
	const userRole = locals.user?.role;
	const filter = userId ? (userRole === UserRole.ADMIN ? {} : { submittedBy: userId }) : null;
	const total = filter ? await Claim.countDocuments(filter) : 0;
	const totalPages = Math.max(1, Math.ceil(total / limit));
	const page = Math.min(parsedPage ?? 1, totalPages);

	const pageInvalid = pageParam != null && (parsedPage == null || parsedPage !== page);
	const limitInvalid = limitParam != null && (parsedLimit == null || !isPageSize(parsedLimit));
	if (pageInvalid || limitInvalid) {
		const params = new URLSearchParams(url.searchParams);
		if (page <= 1) params.delete('page');
		else params.set('page', String(page));
		if (limit === DEFAULT_PAGE_SIZE) params.delete('limit');
		else params.set('limit', String(limit));
		const query = params.toString();
		redirect(307, query ? `${url.pathname}?${query}` : url.pathname);
	}

	if (!filter) {
		return { claims: [], page, limit, total, totalPages };
	}

	const claims = await Claim.find(filter)
		.sort({ updatedAt: -1 })
		.skip((page - 1) * limit)
		.limit(limit)
		.select(
			'_id expenseItem expenseDate totalAmount remarks status receiptImages submittedBy updatedBy'
		)
		.populate('submittedBy', 'displayName')
		.populate('updatedBy', 'displayName')
		.lean();

	return {
		claims: claims.map((claim) => ({
			id: String(claim._id),
			expenseItem: String(claim.expenseItem),
			expenseDate:
				claim.expenseDate instanceof Date
					? claim.expenseDate.toISOString().slice(0, 10)
					: String(claim.expenseDate).slice(0, 10),
			totalAmount: Number(claim.totalAmount),
			receiptName: Array.isArray(claim.receiptImages) ? String(claim.receiptImages[0] ?? '') : '',
			status: claim.status as ClaimStatus,
			remarks: String(claim.remarks ?? ''),
			submittedBy: String(claim.submittedBy?.displayName ?? ''),
			updatedBy: String(claim.updatedBy?.displayName ?? ''),
			updatedAt: claim.updatedAt ? new Date(claim.updatedAt).toISOString().slice(0, 10) : null
		})),
		page,
		limit,
		total,
		totalPages
	};
}) satisfies PageServerLoad;

async function updateClaimStatus(
	user: UserType,
	request: Request,
	status: ClaimStatus.APPROVED | ClaimStatus.REJECTED
) {
	const userId = user.id;
	const userRole = user.role;

	if (userRole !== UserRole.ADMIN)
		return fail(401, { error: 'You are not authorized to update a claim' });

	if (!userId) return fail(401, { error: 'You have to login to update a claim' });

	const id = String((await request.formData()).get('id') ?? '');
	if (!id) return fail(400, { error: 'Missing claim' });

	const now = new Date();
	const update =
		status === ClaimStatus.APPROVED
			? { status, approvedAt: now, updatedBy: userId }
			: { status, rejectedAt: now, updatedBy: userId };

	const result = await Claim.updateOne({ _id: id }, update);
	if (result.matchedCount === 0) return fail(404, { error: 'Claim not found' });

	return { success: true };
}

export const actions = {
	approve: async ({ request, locals }) =>
		updateClaimStatus(locals.user as UserType, request, ClaimStatus.APPROVED),
	reject: async ({ request, locals }) =>
		updateClaimStatus(locals.user as UserType, request, ClaimStatus.REJECTED)
} satisfies Actions;
