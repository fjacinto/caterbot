# REAP — Company workspace + shopping

Responsive UI for interacting with an existing agent. Company is the default experience; Shopping opens the preserved product/quote/checkout flow. This does not implement or connect a live agent.

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

Read `dist/agent-adapter.mjs`: commented request/response contract and suggested backend calls. The user requested placeholders for later integration. The adapter returns local demo proposals; it never sends task instructions to an external service.

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
