# REAP Agentic Payments — Workspace + Katerbot

Repositorio único con **dos experiencias** que comparten el mismo objetivo: demostrar pagos agénticos con aprobación humana, presupuesto y trazabilidad — sin conectar dinero real.

| App | Carpeta | Stack | Cómo se ejecuta |
|---|---|---|---|
| **REAP Workspace** (Company + Shopping + agente híbrido) | `dist/`, `shopping.html`, `reference/` | HTML/CSS/ES modules, sin build, sin dependencias | `npm start` → http://localhost:4173 |
| **Katerbot** 🧺🤖 (inventario de comida + Reap Agentic Payments) | `katerbot/` | Next.js 15 (App Router) + TypeScript + Tailwind + SQL Server 2025 | `cd katerbot && npm run dev` → http://localhost:3000 |

> ⚠️ **Nada se compra, paga, matricula, escala ni contabiliza externamente.** Todos los montos, empresas, proveedores, roles, actividad y tipos de cambio son datos de ejemplo. No introduzcas datos sensibles.

---

## Índice

1. [Requisitos](#1-requisitos)
2. [Inicio rápido](#2-inicio-rápido)
3. [Workspace — experiencia Company](#3-workspace--experiencia-company)
4. [Workspace — experiencia Shopping](#4-workspace--experiencia-shopping)
5. [Workspace — agente híbrido de recursos](#5-workspace--agente-híbrido-de-recursos)
6. [Workspace — preparación REAP Agentic Payments](#6-workspace--preparación-reap-agentic-payments)
7. [Katerbot — estructura](#7-katerbot--estructura)
8. [Katerbot — configuración y variables de entorno](#8-katerbot--configuración-y-variables-de-entorno)
9. [Katerbot — SQL Server 2025](#9-katerbot--sql-server-2025)
10. [Katerbot — API](#10-katerbot--api)
11. [Katerbot — integración con Reap](#11-katerbot--integración-con-reap)
12. [Seguridad de datos de pago](#12-seguridad-de-datos-de-pago)
13. [Guiones de demo](#13-guiones-de-demo)
14. [Tests](#14-tests)
15. [Limitaciones conocidas](#15-limitaciones-conocidas)
16. [Backend real: checklist de implementación](#16-backend-real-checklist-de-implementación)
17. [IA / MCP (opcional, Katerbot)](#17-ia--mcp-opcional-katerbot)

---

## 1. Requisitos

- **Node.js 20+**
- (Opcional) **SQL Server 2025** Developer/Enterprise — los scripts `001`/`002` también corren en 2019/2022; `003` requiere 2025 por `VECTOR`.
- (Opcional) Llave sandbox de **Reap** con Agentic Payments habilitado.

El Workspace no requiere ninguna dependencia ni servicio remoto. Katerbot funciona **offline + MOCK** sin SQL Server ni llave de Reap (las insignias del header lo indican).

---

## 2. Inicio rápido

### 2.1 Workspace (Company + Shopping)

```bash
npm start          # http://localhost:4173
npm test           # tests de flujos de negocio y shopping
```

Buildless: HTML/CSS/ES modules, sin `package.json` con dependencias.

### 2.2 Katerbot

```bash
cd katerbot
cp .env.example .env.local
npm install
npm run dev              # http://localhost:3000
# producción
npm run build && npm start
```

Sin SQL Server ni llave de Reap, todo corre en **modo offline + MOCK**.

---

## 3. Workspace — experiencia Company

Experiencia por defecto. UI responsive con sidebar, navegación móvil, drawers modales accesibles con focus trapping y switch Company/Shopping.

- **Overview** — disponible, gastado, reservado, pendiente de revisión; presupuestos por departamento; compositor de tareas y actividad.
- **Agent requests** — instrucciones estructuradas, proveedor/moneda/monto, departamento, FX y comisiones ilustrativas, filtros y búsqueda.
- **Approvals** — destinatario, destino de pago, totales y chequeos de política; consentimiento explícito; reserva; pago simulado separado. Aprobaciones caducadas o modificadas fallan. Re-revisión/cancelación libera reservas.
- **Budgets & policies** — edición de asignaciones por departamento, umbral de revisión financiera, política de proveedores aprobados. No se puede reducir el presupuesto por debajo de los fondos comprometidos.
- **Suppliers & payments** — destinos de ejemplo aprobados y cola de pagos.
- **Compute** — techo diario, instancias máximas, pausar/reanudar creación de propuestas, solicitudes de escalado simuladas. Revalida límites en aprobación/pago. Sin monitoreo ni escalado cloud real.
- **Reconciliation** — referencias de factura, clasificación de ledger, filtro de evidencia faltante, conciliación local y export CSV. Sin conector contable.

**Estado:** en `sessionStorage` con alcance de pestaña bajo `reap-company-v1`. Shopping usa `reap-demo`. Sin sincronización entre usuarios ni dispositivos.

---

## 4. Workspace — experiencia Shopping

Flujo de producto/cotización/checkout preservado en `shopping.html`, `app.js`, `domain.mjs`, `styles.css`.

Impuesto del demo fijo en **8%**. Ninguna compra es real.

---

## 5. Workspace — agente híbrido de recursos

La app ejecuta `dist/hybrid-agent.mjs`, una adaptación determinista de dominio del `main.py` aportado. El fuente Python sin cambios se conserva en `reference/main.py`.

> El original espera observaciones de granja de Kaggle y emite acciones de granja; **NO** se ejecuta contra observaciones de empresa inventadas. Es un port explícito a JavaScript de mecanismos de planificación reutilizables — no es el runtime Python original ni un LLM.

**Mecanismos reutilizados:**

- Prioridad dividida por esfuerzo: `priority / (1 + 0.65 * effort)`
- Bonus de compromiso de ruta: **1.8**
- Histéresis de perfil: **15%**
- Memoria por modo, revalidación, deadlines duros, reservas compartidas y colchón de caja.

Los candidatos, costos y beneficios de negocio son entradas ilustrativas nuevas. **Esta heurística no es globalmente óptima.** Shopping reinicia la preferencia de ruta en cada comparación para que una elección previa no anule una opción nueva más barata.

`agent-adapter.mjs` devuelve resultados reales de planificación y política locales en lugar de un placeholder. La integración remota sigue comentada. `dist/agent-adapter.mjs` documenta el contrato request/response y las llamadas backend sugeridas; nunca envía instrucciones de tarea a un servicio externo.

**Demo:**

1. Company → **Demo: optimizar recursos**.
2. Mantén reserva `$5,000`, máximo 3 tareas, horizonte 7 días; elige *balanced*, *potential savings* o *speed*.
3. Ve recomendaciones rankeadas, gasto propuesto, reserva protegida y motivos de aplazamiento. **Los ahorros futuros no se suman al dinero disponible.**
4. **Crear propuestas para revisar** → crea solicitudes de revisión, no pagos. Se excluyen solicitudes existentes con el mismo escenario.
5. Revisa → aprueba/reserva → pago simulado → concilia.
6. Aumenta la reserva o acorta el horizonte y recalcula para ver cambiar la decisión.

> Las reservas del plan son **restricciones de escenario**, no políticas de caja globales.

**Demo Shopping:**

1. Cambia a Shopping → panel **Demo · Compra con límites** en el catálogo.
2. Default: audífonos, USD 170 con envío/impuesto, dentro de 7 días hábiles, menor total.
3. El motor recomienda **Everyday Headphones** con envío Standard: `$129 + $5 + $10.72 = $144.72`.
4. **Usar esta recomendación** llena producto y envío; continúa checkout, dirección de ejemplo, aprueba el pago simulado.
5. Con **1 día** recomienda envío next-day; con **$100** no hay audífonos factibles. Las estimaciones de entrega siguen siendo valores mock del catálogo.
6. Cambios de cantidad o envío se **revalidan** contra el presupuesto y deadline originales antes de aprobar/pagar. Seleccionar otro producto manualmente inicia una selección nueva sin restricciones.

---

## 6. Workspace — preparación REAP Agentic Payments

Abre `reap.html` (enlaces en Company y Shopping) para *connection readiness* y un ensayo local de enrollment-a-checkout. **La API live permanece desconectada.**

Referencias: `REAP_INTEGRATION.md`, `.env.example`, `server/reap-client.mjs`, `dist/reap-contract.mjs`.

> El cliente de servidor es fuente para integración futura, **no un backend desplegado**. Esta app no recoge tarjetas ni llaves reales.

---

## 7. Katerbot — estructura

```
katerbot/
├── sql/
│   ├── 001_schema.sql              # users, cater_items, consumption_logs, alerts, budget_settings, reap_orders (+ vista)
│   ├── 002_seed_demo.sql           # usuario demo + leche, pan, huevos, pollo, arroz, fruta (fechas relativas a hoy)
│   └── 003_ai_learning_optional.sql# OPCIONAL: tabla VECTOR(1536) + SP de similitud para MCP/IA (SQL Server 2025)
├── src/
│   ├── app/
│   │   ├── page.tsx                # Despensa (dashboard)
│   │   ├── demo/page.tsx           # Página para jueces: explicación + demo guiada con llamadas reales
│   │   ├── reap/return/page.tsx    # return URL de las páginas hospedadas de Reap
│   │   └── api/…                   # backend (ver §10)
│   ├── components/                 # Dashboard, PurchaseFlow (resumen + flujo Reap), DemoGuide, Header
│   └── lib/
│       ├── calc.ts                 # agotamiento, alertas, gasto semanal, aprendizaje del consumo diario
│       ├── agent.ts                # agente de reposición (reglas, sin LLM)
│       ├── orders.ts               # ciclo de vida del pedido + reabastecer inventario
│       ├── reap/client.ts          # cliente Reap (LIVE/MOCK) + headers
│       ├── reap/mock.ts            # backend Reap simulado
│       ├── reap/sanitize.ts        # elimina PAN/CVV/OTP de cualquier payload
│       ├── reap/types.ts           # shapes de request/response (documentados)
│       └── db/                     # repo SQL Server (mssql) + repo offline (JSON)
└── .env.example
```

**Katerbot** es un agente que administra el inventario y el gasto diario de comida, detecta productos próximos a caducar o agotarse, propone una reposición dentro del presupuesto y — con la aprobación del usuario — compra mediante la API de Reap Agentic Payments.

- UI responsive, bilingüe **ES / EN** (toggle en el header).
- Next.js 15 (App Router) + TypeScript + Tailwind, backend propio en `/api/*`.
- SQL Server 2025 — scripts T-SQL en `sql/`.
- Reap **LIVE** con `REAP_API_KEY`, o **MOCK** (offline, etiquetado en la UI) sin llave.
- **Nunca** se guarda ni se muestra número de tarjeta, CVV ni OTP.

---

## 8. Katerbot — configuración y variables de entorno

```bash
cd katerbot
cp .env.example .env.local
npm install
```

| Variable | Descripción |
|---|---|
| `SQLSERVER_CONNECTION_STRING` | Cadena ADO.NET. Vacía ⇒ modo offline con `data/dev-store.json`. |
| `REAP_BASE_URL` | p. ej. `https://mx.sandbox.api.reap.global` o `https://sandbox.api.reap.global` |
| `REAP_API_KEY` | Llave de Reap. Vacía ⇒ MOCK. **Nunca la subas al repo.** |
| `REAP_VERSION` | Header `Reap-Version` (default `2025-02-14`). |
| `REAP_AUTH_STYLE` | `bearer` (default, `Authorization: Bearer <key>`) o `x-api-key`. |
| `REAP_SIMULATE_CHECKOUT` | Solo sandbox: `COMPLETED` envía `X-Simulate-Checkout`. Vacío en producción. |
| `REAP_COUNTRY` / `REAP_CURRENCY` | Contexto de búsqueda (default `MX` / `MXN`). |
| `REAP_SHIPPING_ADDRESS_JSON` | (Opcional) JSON con `shippingAddress` si el comercio exige envío. |
| `APP_BASE_URL` | URL pública para los `returnUrl` de Reap (default: origen de la petición). |
| `MOCK_QUOTE_TTL_SECONDS` | Vida de la cotización en MOCK (default 180 s) — pon `20` para demostrar expiración. |

---

## 9. Katerbot — SQL Server 2025

```bash
# Docker (Linux):
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=<StrongPwd!>" \
  -p 1433:1433 -d mcr.microsoft.com/mssql/server:2025-latest

sqlcmd -S localhost,1433 -U sa -P '<StrongPwd!>' -C -i sql/001_schema.sql
sqlcmd -S localhost,1433 -U sa -P '<StrongPwd!>' -C -i sql/002_seed_demo.sql
# opcional (IA/MCP):
sqlcmd -S localhost,1433 -U sa -P '<StrongPwd!>' -C -i sql/003_ai_learning_optional.sql
```

`.env.local`:

```
SQLSERVER_CONNECTION_STRING=Server=localhost,1433;Database=Katerbot;User Id=sa;Password=<StrongPwd!>;Encrypt=true;TrustServerCertificate=true
```

> **Recomendado:** crea un login de aplicación con permisos solo de `db_datareader`/`db_datawriter` en lugar de `sa`.

---

## 10. Katerbot — API

| Método | Ruta | Qué hace |
|---|---|---|
| `GET` | `/api/status` | Modo BD (`sqlserver`/`memory`), modo Reap (`live`/`mock`), presupuesto y gasto semanal |
| `GET/POST` | `/api/items` | Inventario con `days_to_depletion`, `estimated_depletion_date`, `days_to_expiry` / alta manual (+ `budget_check`) |
| `GET/PUT/DELETE` | `/api/items/:id` | CRUD de un alimento |
| `GET/POST` | `/api/consumption` | Logs / registrar consumo (resta stock, re-aprende consumo diario, recalcula alertas) |
| `DELETE` | `/api/consumption/:id` | Borrar log |
| `GET` | `/api/alerts` | Recalcula y devuelve alertas abiertas |
| `PATCH` | `/api/alerts/:id` | Resolver alerta |
| `GET/PUT` | `/api/budget` | Presupuesto semanal, moneda, días de alerta |
| `POST` | `/api/agent/replenish` | Agente: propuesta (productos, cantidades, motivos, presupuesto). **No compra.** |
| `GET/POST` | `/api/orders` | Historial `reap_orders` / crear pedido `DRAFT` tras confirmar el resumen |
| `GET` | `/api/orders/:id` | Detalle |
| `POST` | `/api/reap/enrollments` · `GET` | Reap `POST /agentic/enrollments` (reusa si ya está `ACTIVE`) · refrescar estado |
| `POST` | `/api/orders/:id/search` | Reap `POST /agentic/products/search` por línea; elige la variante más barata disponible |
| `POST` | `/api/orders/:id/quote` | Reap `POST /agentic/quotes` (también re-cotiza tras expirar) |
| `POST` | `/api/orders/:id/checkout` | Reap `POST /agentic/checkouts` (valida expiración y enrollment `ACTIVE`) |
| `POST` | `/api/orders/:id/sync` | Reap `GET /agentic/checkouts/:id` tras volver de la aprobación |
| `POST` | `/api/orders/:id/cancel` | Cancelar antes de pagar |
| `POST` | `/api/demo/reset` | Recargar datos demo |

**Errores:** `{ "error": { "code": "QUOTE_EXPIRED", "message": "…" } }` con el status HTTP correspondiente.

### Reglas

- **Agotamiento:** `days_to_depletion = quantity / daily_consumption_estimate` (columna calculada en SQL y en `calc.ts`).
- **Alertas:** caduca en ≤ 3 días · se agota en ≤ 3 días · gasto semanal (compras de 7 días + pedidos Reap completados) > presupuesto. Al agregar un alimento se devuelve `budget_check`. Los días son configurables (`budget_settings.alert_days`).
- **Aprendizaje del consumo:** cada log mezcla 50/50 la estimación actual con el promedio observado en 7 días.
- **Agente (`katerbot-rules-v1`):** prioriza agotamiento > caducidad > historial de compras; dimensiona para ~5 días (el stock que caduca se considera inutilizable); redondea a empaques (huevo ×12, pan ×6); marca como **opcional** lo que no cabe en el presupuesto restante; da motivos ES/EN.

---

## 11. Katerbot — integración con Reap

Basado en la documentación pública (`docs.reap.global`, `Reap-Version: 2025-02-14`).

**Headers en cada llamada LIVE:**

- `Authorization: Bearer <REAP_API_KEY>` (o `X-API-Key` si `REAP_AUTH_STYLE=x-api-key`)
- `Reap-Version: 2025-02-14`
- `Idempotency-Key: <uuid>` en todos los POST que crean (enrollment, quote, checkout). Checkout usa la clave determinista `katerbot-checkout-<orderId>-<quoteId>` ⇒ **un reintento nunca cobra dos veces**.
- `X-Simulate-Checkout: COMPLETED` solo si `REAP_SIMULATE_CHECKOUT` está definido (sandbox).

| Paso | Request enviado | Campos usados de la respuesta |
|---|---|---|
| `POST /agentic/enrollments` | `{ source: "EXTERNAL", owner: { type: "CLIENT_REFERENCE", reference }, email, presentation: { type: "REDIRECT", returnUrl } }` | `id`, `status` (`REQUIRES_ACTION`/`ACTIVE`/…), `nextAction.url` |
| `GET /agentic/enrollments/:id` | — | `status` |
| `POST /agentic/products/search` | `{ query, context: { country, currency }, filters: { availability: "AVAILABLE_ONLY" }, pagination: { limit: 5 } }` | `products[].id`, `merchant.name`, `previewVariant.{id, price, available}` |
| `POST /agentic/quotes` | `{ items: [{ variantId, quantity }], email, shippingAddress? }` | `id`, `amountBreakdown.{itemsSubtotal, shipping, tax, finalAmount}`, `expiresAt` |
| `POST /agentic/checkouts` | `{ quoteId, enrollmentId, presentation: { type: "REDIRECT", returnUrl } }` | `id`, `status`, `nextAction.url`, `amount` |
| `GET /agentic/checkouts/:id` | — | `status`, `orderId`, `finalAmount` |

### Supuestos (verificar en tu sandbox)

1. Para `source: "EXTERNAL"` los nombres exactos del owner (`owner.type = "CLIENT_REFERENCE"`, `owner.reference`) y `email` se infirieron de la guía *How it works*; la referencia de API documenta en detalle `REAP_CARD`. Si tu proyecto usa Reap cards, cambia el body en `src/app/api/reap/enrollments/route.ts` a `{ source: "REAP_CARD", cardId, presentation }`.
2. La respuesta de enrollment expone la URL hospedada de captura de tarjeta en `nextAction.url` (igual que checkout).
3. Se usa directamente `previewVariant` de la búsqueda como variante comprable (se omiten `/products/details` y `/products/variant`; válido para productos sin opciones).
4. La opción de envío preseleccionada en la cotización se acepta tal cual (no se llama `/quotes/:id/shipping-option`).
5. Errores con forma `{ error: { code, message, detail } }`.
6. El precio estimado del agente usa el precio histórico del inventario; **el monto real es siempre `finalAmount` de Reap** (eso es lo que se guarda).

---

## 12. Seguridad de datos de pago

- La tarjeta se captura **solo** en la página hospedada de Reap.
- `reap_orders` y `users` **no** tienen columnas para PAN, CVV ni OTP; solo `enrollment_id`, `quote_id`, `checkout_id`, `order_reference`, `status`, monto y moneda.
- `src/lib/reap/sanitize.ts` elimina claves sensibles (`cardNumber`, `cvv`, `otp`, …) y cadenas tipo PAN de cualquier respuesta antes de guardarla o enviarla al navegador.
- El paso 10 de `/demo` verifica que el registro guardado no contenga datos de tarjeta.
- En el Workspace, los chequeos de snapshot en el navegador son **lógica de demostración, no resistencia a manipulación**.

---

## 13. Guiones de demo

### 13.1 Katerbot (3–4 min)

1. Abre `/demo` → explica el flujo con el diagrama. Muestra las insignias Reap **MOCK/LIVE** y BD.
2. **Paso 0** Datos demo → leche, pan, huevos, pollo, arroz, fruta.
3. **Paso 1** Agregar alimento (Yogur) → muestra `days_to_depletion` y `budget_check`.
4. **Paso 2** Registrar consumo de leche → baja stock y re-aprende el consumo diario.
5. **Paso 3** Alertas → Leche/Pollo caducan, Pan/Pollo se agotan.
6. **Paso 4** Propuesta del agente → cantidades, motivos y qué queda fuera del presupuesto (Pollo opcional).
7. **Paso 5** → marca *“Confirmo este resumen”* (humano en el ciclo) → pedido `DRAFT`.
8. **Pasos 6–9** → Reap enrollment → search → quote (total + `expiresAt`) → checkout.
9. **Paso 10** → `reap_orders` guardado con IDs y estado: `PASS — no PAN / CVV / OTP`.
10. Ve a **Despensa**: inventario reabastecido, alertas actualizadas, pedido en el historial. Repite desde la UI con *Generar propuesta → Revisar resumen → Confirmar y cotizar → Aprobar y pagar*, y muestra **Cancelar** y la **expiración** (arranca con `MOCK_QUOTE_TTL_SECONDS=20`).

### 13.2 Workspace

Ver §5 (demos de Company y Shopping).

---

## 14. Tests

```bash
npm test          # Workspace: planificación + flujos de negocio y shopping
```

Katerbot: el flujo completo se probó end-to-end en modo **offline + MOCK**. El repo SQL Server se compiló y tipó, pero no se probó contra una instancia real en este entorno.

---

## 15. Limitaciones conocidas

**Workspace**

- Todo es dato de ejemplo. Impuesto del shopping fijo al 8%; FX de negocio fijo y explícitamente ilustrativo.
- Estado en `sessionStorage` de pestaña. Sin sincronización entre usuarios ni dispositivos, sin backend persistente, sin subida de facturas, sin datos bancarios reales ni consultas de saldo en vivo.
- El service worker no cachea páginas autenticadas privadas.
- Fuentes externas pueden requerir red.
- El manifest soporta lanzamiento standalone en navegadores compatibles: es una **web app responsive, no una app nativa compilada**.
- El agente híbrido es heurístico y **no garantiza optimalidad global**.

**Katerbot**

- Un solo usuario demo (sin autenticación) — fuera del alcance del hackathon.
- El modo offline guarda en `data/dev-store.json` (ignorado por git).
- No hay conexión a servicios reales de pago, contabilidad, precios ni ejecución cloud.

---

## 16. Backend real: checklist de implementación

Cuando conectes el backend real (Workspace §6 y Katerbot §11):

1. **Autentica** el workspace/usuario y aplica aprobaciones por rol **server-side**.
2. Envía `mode: company | shopping` e intención/contexto estructurado al agente existente.
3. **Persiste** versiones de request, política y cotización. Obtén precios, FX, comisiones y destino del pago de **socios confiables**.
4. **Vincula la aprobación** a un `quote ID/version` inmutable, destinatario/destino, total, moneda, expiración, presupuesto y alcance. Firma o valida los tokens de checkout **en el servidor**.
5. **Reserva presupuestos atómicamente.** Ejecuta **una sola vez** con idempotencia y callbacks de pago firmados; usa lecturas autoritativas tras las return URLs — **nunca confíes en los redirects como prueba de pago**.
6. **Separa** aprobación, pago, fulfillment y conciliación. Conserva rutas de reintento/error y libera reservas al cancelar/expirar.
7. **Aplica límites de cómputo** en el proveedor/controlador. Configura app links verificados y fallback HTTPS para una eventual app móvil nativa.
8. **Concilia** pago/factura/moneda/ledger y contabiliza **una sola vez** vía el conector contable. Registra un **audit trail**.

---

## 17. IA / MCP (opcional, Katerbot)

El agente de la demo es determinista (reglas) para funcionar offline. Para aprender de pedidos anteriores con IA:

1. Ejecuta `sql/003_ai_learning_optional.sql` (tabla `order_learning` con `VECTOR(1536)`, vista `v_order_history`, SP `usp_similar_orders` con `VECTOR_DISTANCE`).
2. Genera embeddings (SQL Server 2025 `AI_GENERATE_EMBEDDINGS` con `CREATE EXTERNAL MODEL`, o desde la app).
3. Expón la vista/SP mediante un servidor **MCP de SQL Server** para que un LLM los consulte como herramienta y complemente `buildProposal()` en `src/lib/agent.ts`.

---

**Caterbot 🧺🤖** — Agentic Payments hackathon × Reap.
