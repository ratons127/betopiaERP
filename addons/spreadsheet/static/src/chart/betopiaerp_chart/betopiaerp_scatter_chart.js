import { registries, chartHelpers } from "@betopiaerp/o-spreadsheet";
import { _t } from "@web/core/l10n/translation";
import { BetopiaERPChart } from "./betopiaerp_chart";
import { onBetopiaERPChartItemHover, onBetopiaERPChartItemClick } from "./betopiaerp_chart_helpers";

const { chartRegistry } = registries;

const {
    getScatterChartDatasets,
    CHART_COMMON_OPTIONS,
    getChartLayout,
    getScatterChartScales,
    getLineChartTooltip,
    getChartTitle,
    getScatterChartLegend,
    getChartShowValues,
    getTrendDatasetForLineChart,
} = chartHelpers;

export class BetopiaERPScatterChart extends BetopiaERPChart {
    constructor(definition, sheetId, getters) {
        super(definition, sheetId, getters);
        this.verticalAxisPosition = definition.verticalAxisPosition;
        this.axesDesign = definition.axesDesign;
        this.zoomable = definition.zoomable;
    }

    getDefinition() {
        return {
            ...super.getDefinition(),
            verticalAxisPosition: this.verticalAxisPosition,
            axesDesign: this.axesDesign,
            zoomable: this.zoomable,
        };
    }
}

chartRegistry.add("betopiaerp_scatter", {
    match: (type) => type === "betopiaerp_scatter",
    createChart: (definition, sheetId, getters) =>
        new BetopiaERPScatterChart(definition, sheetId, getters),
    getChartRuntime: createBetopiaERPChartRuntime,
    validateChartDefinition: (validator, definition) =>
        BetopiaERPScatterChart.validateChartDefinition(validator, definition),
    transformDefinition: (definition) => BetopiaERPScatterChart.transformDefinition(definition),
    getChartDefinitionFromContextCreation: () =>
        BetopiaERPScatterChart.getDefinitionFromContextCreation(),
    name: _t("Scatter"),
});

function createBetopiaERPChartRuntime(chart, getters) {
    const background = chart.background || "#FFFFFF";
    const { datasets, labels } = chart.dataSource.getData();

    const definition = chart.getDefinition();
    const locale = getters.getLocale();

    const trendDataSetsValues = datasets.map((dataset, index) => {
        const trend = definition.dataSets[index]?.trend;
        return !trend?.display
            ? undefined
            : getTrendDatasetForLineChart(trend, dataset.data, labels, "category", locale);
    });

    const chartData = {
        labels,
        dataSetsValues: datasets.map((ds) => ({ data: ds.data, label: ds.label })),
        locale,
        trendDataSetsValues,
        axisType: definition.axisType || "category",
    };

    const config = {
        type: "line",
        data: {
            labels: chartData.labels,
            datasets: getScatterChartDatasets(definition, chartData),
        },
        options: {
            ...CHART_COMMON_OPTIONS,
            layout: getChartLayout(definition, chartData),
            scales: getScatterChartScales(definition, chartData),
            plugins: {
                title: getChartTitle(definition, getters),
                legend: getScatterChartLegend(definition, chartData),
                tooltip: getLineChartTooltip(definition, chartData),
                chartShowValuesPlugin: getChartShowValues(definition, chartData),
            },
            onHover: onBetopiaERPChartItemHover(),
            onClick: onBetopiaERPChartItemClick(getters, chart),
        },
    };

    return { background, chartJsConfig: config };
}
