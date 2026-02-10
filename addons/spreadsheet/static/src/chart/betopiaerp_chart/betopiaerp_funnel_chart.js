import { registries, chartHelpers } from "@betopiaerp/o-spreadsheet";
import { _t } from "@web/core/l10n/translation";
import { BetopiaERPChart } from "./betopiaerp_chart";
import { onBetopiaERPChartItemHover, onBetopiaERPChartItemClick } from "./betopiaerp_chart_helpers";

const { chartRegistry } = registries;

const {
    getFunnelChartDatasets,
    CHART_COMMON_OPTIONS,
    getChartLayout,
    getChartTitle,
    getChartShowValues,
    getFunnelChartScales,
    getFunnelChartTooltip,
    makeDatasetsCumulative,
} = chartHelpers;

export class BetopiaERPFunnelChart extends BetopiaERPChart {
    constructor(definition, sheetId, getters) {
        super(definition, sheetId, getters);
        this.cumulative = definition.cumulative;
        this.funnelColors = definition.funnelColors;
    }

    getDefinition() {
        return {
            ...super.getDefinition(),
            cumulative: this.cumulative,
            funnelColors: this.funnelColors,
        };
    }
}

chartRegistry.add("betopiaerp_funnel", {
    match: (type) => type === "betopiaerp_funnel",
    createChart: (definition, sheetId, getters) =>
        new BetopiaERPFunnelChart(definition, sheetId, getters),
    getChartRuntime: createBetopiaERPChartRuntime,
    validateChartDefinition: (validator, definition) =>
        BetopiaERPFunnelChart.validateChartDefinition(validator, definition),
    transformDefinition: (definition) => BetopiaERPFunnelChart.transformDefinition(definition),
    getChartDefinitionFromContextCreation: () => BetopiaERPFunnelChart.getDefinitionFromContextCreation(),
    name: _t("Funnel"),
});

function createBetopiaERPChartRuntime(chart, getters) {
    const definition = chart.getDefinition();
    const background = chart.background || "#FFFFFF";
    let { datasets, labels } = chart.dataSource.getData();
    if (definition.cumulative) {
        datasets = makeDatasetsCumulative(datasets, "desc");
    }

    const locale = getters.getLocale();

    const chartData = {
        labels,
        dataSetsValues: datasets.map((ds) => ({ data: ds.data, label: ds.label })),
        locale,
    };

    const config = {
        type: "funnel",
        data: {
            labels: chartData.labels,
            datasets: getFunnelChartDatasets(definition, chartData),
        },
        options: {
            ...CHART_COMMON_OPTIONS,
            indexAxis: "y",
            layout: getChartLayout(definition, chartData),
            scales: getFunnelChartScales(definition, chartData),
            plugins: {
                title: getChartTitle(definition, getters),
                legend: { display: false },
                tooltip: getFunnelChartTooltip(definition, chartData),
                chartShowValuesPlugin: getChartShowValues(definition, chartData),
            },
            onHover: onBetopiaERPChartItemHover(),
            onClick: onBetopiaERPChartItemClick(getters, chart),
        },
    };

    return { background, chartJsConfig: config };
}
