import type { PageServerLoad } from './$types';

const claims = [
	{
		id: 'A1-1042',
		expenseItem: 'Taxi',
		expenseDate: '2026-11-02',
		totalAmount: 100,
		receiptName: 'taxi-receipt.jpg',
		status: 'Waiting for supervisor',
		remarks: 'Airport taxi'
	},
	{
		id: 'A1-1038',
		expenseItem: 'Medical Expenses',
		expenseDate: '2026-10-28',
		totalAmount: 680,
		receiptName: 'clinic-invoice.pdf',
		status: 'Finance review',
		remarks: 'Consultation and medicine'
	},
	{
		id: 'A1-1031',
		expenseItem: 'Transportation',
		expenseDate: '2026-10-21',
		totalAmount: 46.5,
		receiptName: '',
		status: 'Applicant confirm',
		remarks: ''
	},
	{
		id: 'A1-1014',
		expenseItem: 'Taxi',
		expenseDate: '2026-10-09',
		totalAmount: 220,
		receiptName: 'oct-taxi.jpg',
		status: 'Paid',
		remarks: 'Client visit'
	}
] as const;

export const load = (() => {
	return { claims };
}) satisfies PageServerLoad;
