import { Claim } from '#lib/server/models/claims.ts';
import { ClaimStatus } from '#lib/constants.ts';
import type { PageServerLoad } from './$types';
import { User } from '#lib/server/models/users.ts';

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
