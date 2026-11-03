import mongoose from 'mongoose';
import { ClaimStatus } from '#lib/constants.ts';

const claimSchema = new mongoose.Schema({
    expenseItem: { type: String, required: true },
    expenseDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    remarks: { type: String, required: false, default: '' },
    remarksForApprover: { type: String, required: false, default: '' },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String, required: true, enum: [
            ClaimStatus.PENDING,
            ClaimStatus.APPROVED,
            ClaimStatus.REJECTED
        ], default: ClaimStatus.PENDING
    },
    receiptImages: { type: [String], required: false, default: [] },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null },
    approvedAt: { type: Date, required: false, default: null },
    rejectedAt: { type: Date, required: false, default: null },
}, {
    timestamps: {
        createdAt: 'createdAt',
    },
    version: false
});

export const Claim = mongoose.models.Claim ?? mongoose.model('Claim', claimSchema);