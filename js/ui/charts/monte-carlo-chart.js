import { charts } from './chart-registry.js';
import { getThemeColors, isDarkThemeActive, MONTE_CARLO_COLORS } from './chart-palette.js';

export function updateMonteCarloChart(state, mcData) {
  const ctx = document.getElementById('chart-monte-carlo');
  if (!ctx) return;

  const ChartGlobal = window.Chart;
  if (!ChartGlobal) {
    console.warn('Chart.js global instance not found yet.');
    return;
  }

  if (!mcData?.labels?.length) return;

  // Destroy existing chart before redrawing
  if (charts.monteCarloChart) {
    try { charts.monteCarloChart.destroy(); } catch (e) { /* ignore */ }
    charts.monteCarloChart = null;
  }

  const { gridColor, labelColor } = getThemeColors(isDarkThemeActive());

  try {
    charts.monteCarloChart = new ChartGlobal(ctx, {
      type: 'line',
      data: {
        labels: mcData.labels,
        datasets: [
          // --- Outer band: p10 to p90 (light fill) ---
          {
            label: '90th Percentile',
            data: mcData.p90Path,
            borderColor: MONTE_CARLO_COLORS.p90.border,
            borderWidth: 2,
            pointRadius: 0,
            fill: '+3', // fill down to p10 dataset (index offset)
            backgroundColor: MONTE_CARLO_COLORS.p90.fill,
            tension: 0.2,
          },
          // --- Inner band: p25 to p75 (stronger fill) ---
          {
            label: '75th Percentile',
            data: mcData.p75Path,
            borderColor: 'transparent',
            borderWidth: 0,
            pointRadius: 0,
            fill: '+1', // fill down to p25
            backgroundColor: MONTE_CARLO_COLORS.p75Fill,
            tension: 0.2,
          },
          {
            label: '25th Percentile',
            data: mcData.p25Path,
            borderColor: 'transparent',
            borderWidth: 0,
            pointRadius: 0,
            fill: false,
            tension: 0.2,
          },
          {
            label: '10th Percentile',
            data: mcData.p10Path,
            borderColor: MONTE_CARLO_COLORS.p10.border,
            borderWidth: 2,
            borderDash: [4, 4],
            pointRadius: 0,
            fill: false,
            tension: 0.2,
          },
          // --- Median line on top ---
          {
            label: 'Median (50th)',
            data: mcData.p50Path,
            borderColor: MONTE_CARLO_COLORS.p50.border,
            borderWidth: 2.5,
            pointRadius: 0,
            fill: false,
            tension: 0.2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: labelColor,
              font: { size: 10, family: 'DM Sans' },
              boxWidth: 12,
              // Only show meaningful labels
              filter: item => ['90th Percentile', 'Median (50th)', '10th Percentile'].includes(item.text),
            },
          },
          tooltip: {
            callbacks: {
              label(context) {
                if (['25th Percentile', '75th Percentile'].includes(context.dataset.label)) return null;
                return ' ' + context.dataset.label + ': $' + Math.round(context.parsed.y).toLocaleString();
              },
            },
          },
        },
        scales: {
          y: {
            grid: { color: gridColor },
            ticks: {
              color: labelColor,
              font: { size: 10, family: 'monospace' },
              callback: value => '$' + Math.round(value).toLocaleString(),
            },
          },
          x: {
            grid: { display: false },
            ticks: { color: labelColor, font: { size: 10 } },
          },
        },
      },
    });
  } catch (error) {
    console.error('Failed to construct Monte Carlo chart:', error);
  }
}
