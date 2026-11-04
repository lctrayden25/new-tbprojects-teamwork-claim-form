import { Claim } from '#lib/server/models/claims';

interface UpdateApproverRemarkResponse<T> {
    success: boolean;
    data: T;
}

export const POST = async ({ request }): Promise<Response> => {
    const { id, remarksForApprover } = await request.json();

    const claim = await Claim.findById(id);
    if (!claim) return new Response('Claim not found', { status: 404 });

    const update = await Claim.findByIdAndUpdate(id, { remarksForApprover }, { new: true });

    return new Response(JSON.stringify({ success: true, data: update } as UpdateApproverRemarkResponse<typeof update>), { status: 200 });
}