import { formatCurrency } from '../../utils/currency.js';
import { charts } from './chart-registry.js';
import { getThemeColors, isDarkThemeActive, GROWTH_COLORS } from './chart-palette.js';

export function createGrowthChart() {
  const ctxCompounding = document.getElementById('growthChart').getContext('2d');
  const { gridColor, labelColor } = getThemeColors(isDarkThemeActive());

  charts.growthChart = new Chart(ctxCompounding, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Liquid Portfolio',
          data: [],
          borderColor: GROWTH_COLORS.liquidPortfolio.border,
          backgroundColor: GROWTH_COLORS.liquidPortfolio.fill,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          fill: true,
          tension: 0.15,
        },
        {
          // Driven by mortgageRate / mortgageTermYears / homeAppreciationRate — previously
          // computed every render but never actually plotted anywhere, so those three
          // inputs had no visible effect. This line is that effect: amortization paying
          // down the mortgage plus home price appreciation, year over year.
          label: 'Home Equity',
          data: [],
          borderColor: GROWTH_COLORS.homeEquity.border,
          backgroundColor: GROWTH_COLORS.homeEquity.fill,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          fill: true,
          tension: 0.15,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: { color: labelColor, font: { family: 'DM Sans', size: 11 }, boxWidth: 12, usePointStyle: true },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label(context) {
              return ' ' + context.dataset.label + ': ' + formatCurrency(context.parsed.y);
            },
          },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: labelColor, font: { family: 'DM Sans', size: 10 } } },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: labelColor,
            font: { family: 'DM Mono', size: 10 },
            callbacks(value) { return formatCurrency(value); },
          },
        },
      },
    },
  });
}

export function updateGrowthChart(simulation) {
  if (!charts.growthChart) return;
  charts.growthChart.data.labels = simulation.growthLabels;
  charts.growthChart.data.datasets[0].data = simulation.growthData;
  charts.growthChart.data.datasets[1].data = simulation.homeEquityData;
  charts.growthChart.update();
}
