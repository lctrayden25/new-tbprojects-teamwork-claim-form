import { Claim } from '#lib/server/models/claims.ts';
import { ClaimStatus } from '#lib/constants.ts';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    create: async ({ request, locals }) => {
        const formData = await request.formData();
        const userId = locals.user?.id;

        if (!userId) {
            return fail(401, { error: 'You have to login to create a claim' });
        }

        const expenseItem = formData.get('expenseItem') as string;
        const expenseDate = formData.get('expenseDate') as string;
        const totalAmount = formData.get('totalAmount') as string;
        const remarks = formData.get('remarks') as string;
        const approverRemarks = formData.get('approverRemarks') as string;

        const claimData = {
            expenseItem,
            expenseDate: new Date(`${expenseDate}T00:00:00.000Z`),
            totalAmount: Number(totalAmount),
            remarks,
            remarksForApprover: approverRemarks,
            status: ClaimStatus.PENDING,
            submittedBy: userId,
        }

        // const receiptImages = formData.get('receiptImages') as string[];

        const claim = await Claim.create(claimData);
        const claimResult = {
            id: claim._id.toString(),
            expenseItem: claim.expenseItem,
            expenseDate: claim.expenseDate.toISOString().slice(0, 10),
            totalAmount: claim.totalAmount,
            remarks: claim.remarks ?? '',
            approverRemarks: claim.remarksForApprover ?? '',
            status: claim.status,
            submittedBy: claim.submittedBy.toString(),
            receiptImages: claim.receiptImages ?? [],
        };

        return { success: true, data: claimResult };
    }
} satisfies Actions;
