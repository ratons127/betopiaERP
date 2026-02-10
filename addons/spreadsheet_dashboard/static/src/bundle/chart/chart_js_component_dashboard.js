import { components } from "@betopiaerp/o-spreadsheet";
import { patch } from "@web/core/utils/patch";

patch(components.ChartJsComponent.prototype, {
    createChart(chartData) {
        if (this.env.model.getters.isDashboard()) {
            chartData = this.addBetopiaERPMenuPluginToChartData(chartData);
        }
        super.createChart(chartData);
    },
    updateChartJs(chartData) {
        if (this.env.model.getters.isDashboard()) {
            chartData = this.addBetopiaERPMenuPluginToChartData(chartData);
        }
        super.updateChartJs(chartData);
    },
    addBetopiaERPMenuPluginToChartData(chartData) {
        chartData.chartJsConfig.options.plugins.chartBetopiaERPMenuPlugin = {
            env: this.env,
            menu: this.env.model.getters.getChartBetopiaERPMenu(this.props.chartId),
        };
        return chartData;
    },
});
