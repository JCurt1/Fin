import { charts } from './chart-registry.js';
import { getThemeColors } from './chart-palette.js';

export function updateChartTheme(mode) {
  const isDark = mode === 'dark';
  const { gridColor, labelColor, legendLabelColor } = getThemeColors(isDark);

  if (charts.growthChart) {
    charts.growthChart.options.scales.x.ticks.color = labelColor;
    charts.growthChart.options.scales.y.ticks.color = labelColor;
    charts.growthChart.options.scales.y.grid.color = gridColor;
    charts.growthChart.update('none');
  }
  if (charts.drawdownChart) {
    charts.drawdownChart.options.scales.x.ticks.color = labelColor;
    charts.drawdownChart.options.scales.y.ticks.color = labelColor;
    charts.drawdownChart.options.scales.y.grid.color = gridColor;
    charts.drawdownChart.update('none');
  }
  if (charts.assetDonut) {
    charts.assetDonut.options.plugins.legend.labels.color = legendLabelColor;
    charts.assetDonut.update('none');
  }
  if (charts.monteCarloChart) {
    charts.monteCarloChart.options.scales.x.ticks.color = labelColor;
    charts.monteCarloChart.options.scales.y.ticks.color = labelColor;
    charts.monteCarloChart.options.scales.y.grid.color = gridColor;
    charts.monteCarloChart.options.plugins.legend.labels.color = labelColor;
    charts.monteCarloChart.update('none');
  }
}
