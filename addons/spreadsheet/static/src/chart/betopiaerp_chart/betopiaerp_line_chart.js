import { registries, chartHelpers } from "@betopiaerp/o-spreadsheet";
import { _t } from "@web/core/l10n/translation";
import { BetopiaERPChart } from "./betopiaerp_chart";
import { onBetopiaERPChartItemClick, onBetopiaERPChartItemHover } from "./betopiaerp_chart_helpers";

const { chartRegistry } = registries;

const {
    getLineChartDatasets,
    CHART_COMMON_OPTIONS,
    getChartLayout,
    getLineChartScales,
    getLineChartTooltip,
    getChartTitle,
    getLineChartLegend,
    getChartShowValues,
    getTrendDatasetForLineChart,
    getTopPaddingForDashboard,
} = chartHelpers;

export class BetopiaERPLineChart extends BetopiaERPChart {
    constructor(definition, sheetId, getters) {
        super(definition, sheetId, getters);
        this.verticalAxisPosition = definition.verticalAxisPosition;
        this.stacked = definition.stacked;
        this.cumulative = definition.cumulative;
        this.cumulatedStart = definition.cumulatedStart;
        this.axesDesign = definition.axesDesign;
        this.fillArea = definition.fillArea;
        this.cumulatedStart = definition.cumulatedStart;
        this.hideDataMarkers = definition.hideDataMarkers;
        this.zoomable = definition.zoomable;
    }

    getDefinition() {
        return {
            ...super.getDefinition(),
            verticalAxisPosition: this.verticalAxisPosition,
            stacked: this.stacked,
            cumulative: this.cumulative,
            cumulatedStart: this.cumulatedStart,
            axesDesign: this.axesDesign,
            fillArea: this.fillArea,
            hideDataMarkers: this.hideDataMarkers,
            zoomable: this.zoomable,
        };
    }
}

chartRegistry.add("betopiaerp_line", {
    match: (type) => type === "betopiaerp_line",
    createChart: (definition, sheetId, getters) => new BetopiaERPLineChart(definition, sheetId, getters),
    getChartRuntime: createBetopiaERPChartRuntime,
    validateChartDefinition: (validator, definition) =>
        BetopiaERPLineChart.validateChartDefinition(validator, definition),
    transformDefinition: (definition) => BetopiaERPLineChart.transformDefinition(definition),
    getChartDefinitionFromContextCreation: () => BetopiaERPLineChart.getDefinitionFromContextCreation(),
    name: _t("Line"),
});

function createBetopiaERPChartRuntime(chart, getters) {
    const background = chart.background || "#FFFFFF";
    let { datasets, labels } = chart.dataSource.getData();
    datasets = computeCumulatedDatasets(chart, datasets);

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
        topPadding: getTopPaddingForDashboard(definition, getters),
        axisType: definition.axisType || "category",
    };

    const chartJsDatasets = getLineChartDatasets(definition, chartData);
    const config = {
        type: "line",
        data: {
            labels: chartData.labels,
            datasets: chartJsDatasets,
        },
        options: {
            ...CHART_COMMON_OPTIONS,
            layout: getChartLayout(definition, chartData),
            scales: getLineChartScales(definition, chartData),
            plugins: {
                title: getChartTitle(definition, getters),
                legend: getLineChartLegend(definition, chartData),
                tooltip: getLineChartTooltip(definition, chartData),
                chartShowValuesPlugin: getChartShowValues(definition, chartData),
            },
            onHover: onBetopiaERPChartItemHover(),
            onClick: onBetopiaERPChartItemClick(getters, chart),
        },
    };

    return { background, chartJsConfig: config };
}

function computeCumulatedDatasets(chart, datasets) {
    const cumulatedDatasets = [];
    for (const dataset of datasets) {
        if (chart.cumulative) {
            let accumulator = dataset.cumulatedStart || 0;
            const data = dataset.data.map((value) => {
                accumulator += value;
                return accumulator;
            });
            cumulatedDatasets.push({ ...dataset, data });
        } else {
            cumulatedDatasets.push(dataset);
        }
    }
    return cumulatedDatasets;
}
