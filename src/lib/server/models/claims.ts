import mongoose from 'mongoose';

export enum ClaimStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}

const claimSchema = new mongoose.Schema({
    expenseItem: { type: String, required: true },
    exposeDate: { type: Date, required: true },
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
    timestamps: true,
    version: false
});

export const Claim = mongoose.models.Claim ?? mongoose.model('Claim', claimSchema);