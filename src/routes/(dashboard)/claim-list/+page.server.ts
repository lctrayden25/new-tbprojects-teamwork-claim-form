import { Claim } from '#lib/server/models/claims.ts';
import { ClaimStatus } from '#lib/constants.ts';
import { User } from '#lib/server/models/users.ts';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const userId = locals.user?.id;

	if (!userId) {
		return { claims: [] };
	}

	const claims = await Claim.find({ submittedBy: userId })
		.select('_id expenseItem expenseDate totalAmount remarks status receiptImages submittedBy')
		.lean();

	const submittedBy = await User.findOne({ _id: userId }).select('displayName').lean();

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
			submittedBy: String(submittedBy?.displayName ?? '')
		}))
	};
}) satisfies PageServerLoad;

async function updateClaimStatus(
	userId: string | undefined,
	request: Request,
	status: ClaimStatus.APPROVED | ClaimStatus.REJECTED
) {
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
		updateClaimStatus(locals.user?.id, request, ClaimStatus.APPROVED),
	reject: async ({ request, locals }) =>
		updateClaimStatus(locals.user?.id, request, ClaimStatus.REJECTED)
} satisfies Actions;
