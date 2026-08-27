import { formatCurrency } from '../../utils/currency.js';
import { charts } from './chart-registry.js';
import { getThemeColors, isDarkThemeActive, DRAWDOWN_COLORS } from './chart-palette.js';

export function createDrawdownChart() {
  const ctxDrawdown = document.getElementById('drawdownChart').getContext('2d');
  const { gridColor, labelColor } = getThemeColors(isDarkThemeActive());

  charts.drawdownChart = new Chart(ctxDrawdown, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Total Portfolio',
          data: [],
          borderColor: DRAWDOWN_COLORS.totalPortfolio.border,
          backgroundColor: DRAWDOWN_COLORS.totalPortfolio.fill,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          fill: true,
          tension: 0.15,
        },
        {
          label: 'Pre-Tax (Traditional)',
          data: [],
          borderColor: DRAWDOWN_COLORS.preTax.border,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderDash: [4, 3],
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: false,
          tension: 0.15,
        },
        {
          label: 'Roth',
          data: [],
          borderColor: DRAWDOWN_COLORS.roth.border,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderDash: [4, 3],
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: false,
          tension: 0.15,
        },
        {
          label: 'Taxable Brokerage',
          data: [],
          borderColor: DRAWDOWN_COLORS.brokerage.border,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderDash: [4, 3],
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: false,
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
          labels: { color: labelColor, font: { family: 'DM Sans', size: 10 }, boxWidth: 12 },
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

export function updateDrawdownChart(drawdownTimelineData) {
  if (!charts.drawdownChart || !drawdownTimelineData?.length) return;

  const labels        = drawdownTimelineData.map(d => 'Age ' + d.age);
  const totalData     = drawdownTimelineData.map(d => d.totalWealth);
  const preTaxData    = drawdownTimelineData.map(d => d.preTax);
  const rothData      = drawdownTimelineData.map(d => d.roth);
  const brokerageData = drawdownTimelineData.map(d => d.brokerage);

  charts.drawdownChart.data.labels                    = labels;
  charts.drawdownChart.data.datasets[0].data          = totalData;
  charts.drawdownChart.data.datasets[1].data          = preTaxData;
  charts.drawdownChart.data.datasets[2].data          = rothData;
  charts.drawdownChart.data.datasets[3].data          = brokerageData;
  charts.drawdownChart.update();
}
