#############################
##  Here's Pulse Project   ##
#############################

Pulse is an analytics dashboard built with React and Recharts. It visualizes
mock data for a fictional SaaS company across a selectable month window.


## What You'll See

Four stat cards at the top:
  - Total Revenue (with % change vs prior period)
  - New Signups (period total)
  - Churned Users (monthly average)
  - Avg NPS (with health label)

Five charts below:
  - Revenue Trend       — area chart of monthly MRR
  - User Signups        — bar chart of monthly signups
  - Tier Distribution   — donut chart of Free / Pro / Enterprise (latest month)
  - Churn vs NPS        — dual-axis line chart
  - Signups by Tier     — stacked bar chart


## How to Open

Open index.html directly in any browser. No install or build step required.
Babel and all dependencies (React 18, Recharts) load from CDN automatically.


## Controls

Date range — two dropdowns in the top bar let you pick any From → To window
             across the available data months. All charts and stat cards update.

Tier toggles — Free, Pro, and Enterprise buttons filter which tiers appear
               in the tier distribution and stacked bar charts.


## Changing the Data or Colors

All mock data lives in ALL_MONTHS at the top of dashboard.jsx.
Add or edit months there and they automatically appear in the dropdowns.

All tier colors are set once in TIER_COLORS (also near the top of dashboard.jsx):
  free       #84cc16  lime green
  pro        #38bdf8  sky blue
  enterprise #eab308  gold

Changing a value there updates every chart, toggle button, and legend at once.


## Source Files

dashboard.jsx   canonical React component — uses ES module imports for bundlers
index.html      browser-ready preview — swaps imports for CDN globals via Babel


## Planned

- 3-month user retention tracking view
- Tier stat cards showing totals and period-over-period % change
