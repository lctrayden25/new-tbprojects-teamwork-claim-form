// import { connectDB } from '#lib/server/db.ts';
// import { Claim, ClaimStatus } from '#lib/server/models/claims.ts';
import type { Actions } from './$types';

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        // await connectDB();
        // const receipt = formData.get('receipt');

        const expenseItem = formData.get('expenseItem') as string;
        const expenseDate = formData.get('exposeDate') as string;
        const totalAmount = formData.get('totalAmount') as string;
        const remarks = formData.get('remarks') as string;
        const approverRemarks = formData.get('approverRemarks') as string;


        console.log({ expenseItem, expenseDate, totalAmount, remarks, approverRemarks })

        // const receiptImages = formData.get('receiptImages') as string[];

        // const claim = await Claim.create({
        //     expenseItem,
        //     exposeDate,
        //     totalAmount,
        //     remarks,
        //     approverRemarks,
        //     // receiptImages,
        //     status: ClaimStatus.PENDING,
        // });



        // const res = {
        //     success: true,
        //     expenseItem: String(formData.get('expenseItem') ?? ''),
        //     expenseDate: String(formData.get('expenseDate') ?? ''),
        //     totalAmount: String(formData.get('totalAmount') ?? ''),
        //     remarks: String(formData.get('remarks') ?? ''),
        //     approverRemarks: String(formData.get('approverRemarks') ?? ''),
        //     receiptImages: receipt instanceof File && receipt.size > 0 ? receipt.name : ''
        // };

        // console.log(res);
        return { success: true };
    }
} satisfies Actions;
