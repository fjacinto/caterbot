/** Integration seam for YOUR existing agent. No agent implementation or secrets here.
 * Replace prepareProposal() with a call to your same-origin backend when ready.
 * The backend should supply tenant/session authentication, policy enforcement,
 * provider secrets, idempotency, trusted quotes and signed payment callbacks.
 * Never expose partner credentials or rely on browser policy checks for real funds.
 * Suggested payload: { mode:'company'|'shopping', intent, instructions,
 *   context:{ departmentId, budgetId, supplierId, amountMinor, currency } }
 * Suggested response: { requestId, state:'needs_input'|'needs_approval',
 *   message, quote:{ id, version, expiresAt, supplierId, destinationId,
 *   amountMinor, feeMinor, totalMinor, currency }, policyChecks:[] }
 * Handle needs_input as a clarification form; needs_approval as the review drawer.
 */
export async function prepareProposal(payload){
 // FUTURE: const response = await fetch('/api/agent/requests', {
 //   method:'POST', credentials:'same-origin',
 //   headers:{'Content-Type':'application/json','Idempotency-Key':crypto.randomUUID()},
 //   body:JSON.stringify(payload)
 // });
 // if (!response.ok) throw new Error('Could not reach your agent. Please retry.');
 // return await response.json();
 return {demo:true,mode:payload.mode,message:'Demo proposal prepared for your review.',input:payload};
}
// FUTURE: GET /api/agent/requests/:id/events or authenticated SSE for progress.
// FUTURE: POST /api/approvals binds user consent to server quote ID + version.
// FUTURE: POST /api/payments consumes server approval, never a browser total.
// FUTURE: GET /api/payments/:id reads authoritative status after merchant return.
// FUTURE: POST /api/reconciliation performs invoice/payment/ledger matching.
// FUTURE: GET/PATCH /api/compute/policy updates enforceable provider spend limits.
