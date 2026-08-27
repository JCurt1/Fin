// Centralized chart color palette. Previously these colors were duplicated (and drifted
// independently) across growth-chart.js, drawdown-chart.js, asset-donut.js, and
// monte-carlo-chart.js. Anything chart-related should pull from here so a palette change
// only has to happen once, and so new charts inherit consistent colors automatically.

// Theme-aware grid/label colors shared by every Chart.js instance. Previously this exact
// function body was copy-pasted verbatim in growth-chart.js and drawdown-chart.js.
export function getThemeColors(isDark) {
  return {
    gridColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
    labelColor: isDark ? '#8b949e' : '#9aa3b5',
    legendLabelColor: isDark ? '#c9d1d9' : '#0d1117',
  };
}

export function isDarkThemeActive() {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

// Growth chart — liquid portfolio vs. home equity.
export const GROWTH_COLORS = {
  liquidPortfolio: { border: '#2563eb', fill: 'rgba(37, 99, 235, 0.04)' },
  homeEquity:      { border: '#d97706', fill: 'rgba(217, 119, 6, 0.04)' },
};

// Drawdown chart — total portfolio plus the three tax-bucket breakdown lines.
export const DRAWDOWN_COLORS = {
  totalPortfolio: { border: '#10b981', fill: 'rgba(16, 185, 129, 0.04)' },
  preTax:         { border: '#3b82f6' },
  roth:           { border: '#a855f7' },
  brokerage:      { border: '#f59e0b' },
};

// Asset allocation donut — one color per balance-sheet category, in the same order the
// donut's labels/data arrays are built (Cash, Retirement, Brokerage, Property).
export const ASSET_DONUT_COLORS = ['#2563eb', '#0e9f6e', '#d97706', '#7c3aed'];

// Monte Carlo percentile bands.
export const MONTE_CARLO_COLORS = {
  p90:    { border: '#00cc66', fill: 'rgba(0, 204, 102, 0.08)' },
  p75Fill: 'rgba(51, 153, 255, 0.12)',
  p50:    { border: '#3399ff' },
  p10:    { border: '#ff4d4d' },
};
