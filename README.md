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
