import { registries, chartHelpers } from "@betopiaerp/o-spreadsheet";
import { _t } from "@web/core/l10n/translation";
import { BetopiaERPChart } from "./betopiaerp_chart";
import { onBetopiaERPChartItemHover, onBetopiaERPChartItemClick } from "./betopiaerp_chart_helpers";

const { chartRegistry } = registries;

const {
    getRadarChartDatasets,
    CHART_COMMON_OPTIONS,
    getChartLayout,
    getChartTitle,
    getChartShowValues,
    getRadarChartScales,
    getRadarChartLegend,
    getRadarChartTooltip,
} = chartHelpers;

export class BetopiaERPRadarChart extends BetopiaERPChart {
    constructor(definition, sheetId, getters) {
        super(definition, sheetId, getters);
        this.fillArea = definition.fillArea;
        this.hideDataMarkers = definition.hideDataMarkers;
    }

    getDefinition() {
        return {
            ...super.getDefinition(),
            fillArea: this.fillArea,
            hideDataMarkers: this.hideDataMarkers,
        };
    }
}

chartRegistry.add("betopiaerp_radar", {
    match: (type) => type === "betopiaerp_radar",
    createChart: (definition, sheetId, getters) => new BetopiaERPRadarChart(definition, sheetId, getters),
    getChartRuntime: createBetopiaERPChartRuntime,
    validateChartDefinition: (validator, definition) =>
        BetopiaERPRadarChart.validateChartDefinition(validator, definition),
    transformDefinition: (definition) => BetopiaERPRadarChart.transformDefinition(definition),
    getChartDefinitionFromContextCreation: () => BetopiaERPRadarChart.getDefinitionFromContextCreation(),
    name: _t("Radar"),
});

function createBetopiaERPChartRuntime(chart, getters) {
    const background = chart.background || "#FFFFFF";
    const { datasets, labels } = chart.dataSource.getData();

    const definition = chart.getDefinition();
    const locale = getters.getLocale();

    const chartData = {
        labels,
        dataSetsValues: datasets.map((ds) => ({ data: ds.data, label: ds.label })),
        locale,
    };

    const config = {
        type: "radar",
        data: {
            labels: chartData.labels,
            datasets: getRadarChartDatasets(definition, chartData),
        },
        options: {
            ...CHART_COMMON_OPTIONS,
            layout: getChartLayout(definition, chartData),
            scales: getRadarChartScales(definition, chartData),
            plugins: {
                title: getChartTitle(definition, getters),
                legend: getRadarChartLegend(definition, chartData),
                tooltip: getRadarChartTooltip(definition, chartData),
                chartShowValuesPlugin: getChartShowValues(definition, chartData),
            },
            onHover: onBetopiaERPChartItemHover(),
            onClick: onBetopiaERPChartItemClick(getters, chart),
        },
    };

    return { background, chartJsConfig: config };
}
