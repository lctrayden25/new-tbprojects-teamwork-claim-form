import { connectDB } from '#lib/server/db.ts';
import type { Actions } from './$types';

export const actions = {
    default: async ({ request }) => {
        const db = await connectDB();
        console.log("connected to db: ", db);
        const formData = await request.formData();
        const receipt = formData.get('receipt');

        const res = {
            success: true,
            expenseItem: String(formData.get('expenseItem') ?? ''),
            expenseDate: String(formData.get('expenseDate') ?? ''),
            totalAmount: String(formData.get('totalAmount') ?? ''),
            remarks: String(formData.get('remarks') ?? ''),
            approverRemarks: String(formData.get('approverRemarks') ?? ''),
            receiptName: receipt instanceof File && receipt.size > 0 ? receipt.name : ''
        };

        console.log(res);
        return res;
    }
} satisfies Actions;
