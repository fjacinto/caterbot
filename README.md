# REAP — Company workspace + shopping

Responsive UI for interacting with an existing agent. Company is the default experience; Shopping opens the preserved product/quote/checkout flow. Now includes a local resource planner adapted from the supplied main.py; see the hybrid-agent section below. No remote agent service is connected.

Run `npm start` and open http://localhost:4173. Run `npm test` for business and shopping workflow tests. Buildless HTML/CSS/ES modules with no package dependencies.

## Company experience

- Overview: available, spent, reserved, pending review; department budgets; task composer and activity.
- Agent requests: structured instructions, supplier/currency/amount, department, illustrative FX and fees, filters and search.
- Approvals: recipient, payment destination, totals and policy checks; explicit consent; reservation; separate simulated payment. Changed/expired approvals fail. Re-review/cancel releases reservations.
- Budgets & policies: edit department allocations, finance-review threshold, approved-supplier policy. Cannot reduce budget below committed funds.
- Suppliers & payments: approved sample destinations and a payment queue.
- Compute: daily ceiling, max instances, pause/resume proposal creation, simulated scale requests. Rechecks limits on approval/payment. No actual monitoring or cloud scaling.
- Reconciliation: invoice references, ledger classification, missing-evidence filter, local reconciliation and CSV export. No accounting connector.
- Responsive sidebar, mobile navigation, accessible modal drawers with focus trapping, and company/shopping mode switch.

## Existing-agent integration

Read `dist/agent-adapter.mjs`: commented request/response contract and suggested backend calls. The adapter runs the adapted local planner and policy checks; it never sends task instructions to an external service. Remote integration remains documented for later.

`dist/business-domain.mjs` models demo policy, budget and approval state. `dist/business.js` binds the UI. `dist/business.css` styles the business workspace. Existing shopping implementation remains in `shopping.html`, `app.js`, `domain.mjs`, and `styles.css`.

When implementing the backend:
1. Authenticate the workspace/user and enforce role-based approvals server-side.
2. Send `mode: company | shopping` and structured intent/context to the existing agent.
3. Persist request, policy and quote versions. Obtain prices, FX, fees and payee destination from trusted partners.
4. Bind approval to immutable quote ID/version, recipient/destination, total, currency, expiration, budget and scope. Sign or otherwise validate checkout tokens on the server. Browser snapshot checks are demonstration logic, not tamper resistance.
5. Atomically reserve budgets. Execute once with idempotency and signed payment callbacks; use authoritative reads after return URLs, never trust redirects as proof of payment.
6. Separate approval, payment, fulfillment and reconciliation. Retain retry/error paths and release reservations when cancelled/expired.
7. Enforce compute limits at the provider/controller. Configure verified app links and HTTPS fallback for an eventual native mobile app.
8. Match payment/invoice/currency/ledger and post once via the accounting connector. Record an audit trail.

## Demo constraints

All amounts, companies, suppliers, roles, activity and exchange rates are sample data. Tax in the shopping demo is fixed at 8%. Business FX is fixed, explicitly illustrative. Nothing is purchased, paid, enrolled, scaled or posted externally. All proposals require manual approval; the threshold only labels finance-review requirements.

Company state is stored in tab-scoped sessionStorage under `reap-company-v1`; shopping uses `reap-demo`. No cross-user or cross-device synchronization, persistent backend, invoice uploads, real bank details or live balance checks. Do not enter sensitive data. External fonts may require network access. Service worker does not cache private authenticated pages.

The web manifest supports standalone launch on compatible browsers; this is a responsive web app, not a compiled native mobile app.

## Hybrid resource agent (connected local demo)

The app now runs `dist/hybrid-agent.mjs`, a deterministic domain adaptation of the user-provided `main.py`. The unchanged Python source is preserved in `reference/main.py`. The original expects Kaggle farm observations and emits farm actions; it is NOT executed against invented company observations. This is an explicit JavaScript port of reusable planning mechanisms, not the original Python runtime and not an LLM.

Reused mechanisms: priority divided by effort (`priority / (1 + 0.65 * effort)`), 1.8 route commitment bonus, 15% profile hysteresis, per-mode memory, revalidation, hard deadlines, shared reservations and a cash buffer. Business candidates, costs and benefits are new illustrative inputs. This heuristic is not guaranteed globally optimal. Shopping resets route preference for each comparison so a prior choice cannot override a cheaper new option.

`agent-adapter.mjs` now returns real local planning and policy results rather than a placeholder. Remote API integration remains commented for later. Payment, accounting, prices and cloud execution remain simulations. Frontend snapshot checks are not tamper-proof security.

### Demo 1: company
1. Open Company → **Demo: optimizar recursos**.
2. Keep reserve $5,000, maximum 3 tasks, horizon 7 days; select balanced, potential savings or speed.
3. See ranked recommendations, proposed spending, protected reserve and reasons for deferral. No future savings are added to available money.
4. Choose **Crear propuestas para revisar**. This creates review requests, not payments. Existing requests with the same scenario are excluded.
5. Review a proposal → approve/reserve → simulate payment → reconcile, as before.
6. Increase reserve or shorten horizon and recalculate to see the decision change. Plan reserves are scenario constraints, not global cash policies.

### Demo 2: shopping
1. Switch to Shopping. The **Demo · Compra con límites** panel is on the catalog page.
2. Default: headphones, USD 170 including shipping/tax, within 7 business days, lowest total.
3. The engine recommends Everyday Headphones with Standard delivery: $129 + $5 + $10.72 = $144.72.
4. **Usar esta recomendación** populates product and shipping; continue checkout, enter sample address, approve simulated payment.
5. Set 1 day to recommend next-day delivery; set $100 to see no feasible headphones. Delivery estimates remain mock catalog values.
6. Changes to quantity or shipping are rechecked against the original shopping budget and deadline before approval/payment. Selecting a different product manually starts a new unconstrained selection.

Run `npm test` for planning and business/shopping tests. No AI subscription or inference API calls are required for these demos.

## REAP Agentic Payments preparation

Open `reap.html` (links in Company and Shopping) for connection readiness and a local enrollment-to-checkout rehearsal. The live API remains disconnected. See `REAP_INTEGRATION.md`, `.env.example`, `server/reap-client.mjs`, and `dist/reap-contract.mjs`. The server client is source for future integration, not a deployed backend. No actual cards or keys are collected by this app.
