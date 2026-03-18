# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pulse is a SaaS analytics dashboard built as a single React component ([dashboard.jsx](dashboard.jsx)). It visualizes mock data for monthly revenue, user signups, subscription tiers, churn, and NPS across a 10-month window (Sep 2024 – Jun 2025).

## Setup

There is no package.json or build tooling configured. To run this component:

1. Create a React project (e.g., `npm create vite@latest` or `npx create-react-app`)
2. Install dependencies: `npm install recharts`
3. Drop `dashboard.jsx` into `src/` and import `Dashboard` from it
4. Use Google Fonts: **Syne** (display) and **DM Mono** (UI/mono)

## Architecture

**Single-file component structure:**
- `Dashboard` — root component, owns all state and layout
- `StatCard` — reusable metric card (value, delta, label, icon)
- `CustomTooltip` — recharts-aware tooltip renderer
- Inline `<style>` tag injected via JSX for all CSS (CSS variables, animations, responsive grid)

**State:**
- `useState` only — no context, Redux, or external store
- `useMemo` for derived values: filtered chart data by range, totals, period-over-period comparisons, tier-filtered aggregates

**Data:**
- Hardcoded mock array (`data`) of 10 monthly entries: `{ month, revenue, signups, churn, nps, free, pro, enterprise }`
- Filtering is purely client-side slice/reduce over this array

**UI behavior:**
- Date range selector: 3, 6, or 10 months (slices the data array from the end)
- Tier toggle: Free / Pro / Enterprise (filters chart series visibility)
- Tab navigation: Overview, Revenue, Users, Retention
- Simulated async load (1.4s) with skeleton shimmer animation on mount
- 3% random error state with retry to test error handling UI

**Design tokens** (CSS variables on `:root`):
- `--accent`: `#6366f1` (indigo)
- `--bg`: `#0f1117`, `--surface`: `#1a1d27`, `--border`: `#2a2d3a`
- `--free`: `#84cc16` (lime), `--pro`: `#38bdf8` (sky blue), `--enterprise`: `#eab308` (gold)
- Charts use indigo, cyan (`#06b6d4`), amber (`#f59e0b`), pink (`#ec4899`)

## Known Gaps / Notes

From the project [Notes](Notes) file:
- Tier distribution cards should show total amounts and percentage changes (partially implemented)
- Color differentiation needed: Enterprise vs Churned lines, Pro vs New Signups bars, Free vs Revenue series
- 3-month retention tracking feature is a planned addition
- Signup highlight card needs darker background styling
- Instead of pre-selected dates, needs to be able to select its own dates
- Should have an option to 