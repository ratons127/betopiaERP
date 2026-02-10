import { registries, chartHelpers } from "@betopiaerp/o-spreadsheet";
import { _t } from "@web/core/l10n/translation";
import { BetopiaERPChart } from "./betopiaerp_chart";
import { onBetopiaERPChartItemHover, onWaterfallBetopiaERPChartItemClick } from "./betopiaerp_chart_helpers";

const { chartRegistry } = registries;

const {
    CHART_COMMON_OPTIONS,
    getChartLayout,
    getChartTitle,
    getWaterfallChartShowValues,
    getWaterfallChartScales,
    getWaterfallChartLegend,
    getWaterfallChartTooltip,
    getWaterfallDatasetAndLabels,
} = chartHelpers;

export class BetopiaERPWaterfallChart extends BetopiaERPChart {
    constructor(definition, sheetId, getters) {
        super(definition, sheetId, getters);
        this.verticalAxisPosition = definition.verticalAxisPosition ?? "left";
        this.showConnectorLines = definition.showConnectorLines ?? true;
        this.positiveValuesColor = definition.positiveValuesColor;
        this.negativeValuesColor = definition.negativeValuesColor;
        this.subTotalValuesColor = definition.subTotalValuesColor;
        this.firstValueAsSubtotal = definition.firstValueAsSubtotal ?? false;
        this.showSubTotals = definition.showSubTotals ?? false;
        this.axesDesign = definition.axesDesign;
        this.zoomable = definition.zoomable ?? false;
    }

    getDefinition() {
        return {
            ...super.getDefinition(),
            verticalAxisPosition: this.verticalAxisPosition,
            showConnectorLines: this.showConnectorLines,
            firstValueAsSubtotal: this.firstValueAsSubtotal,
            showSubTotals: this.showSubTotals,
            positiveValuesColor: this.positiveValuesColor,
            negativeValuesColor: this.negativeValuesColor,
            subTotalValuesColor: this.subTotalValuesColor,
            axesDesign: this.axesDesign,
            zoomable: this.zoomable,
        };
    }
}

chartRegistry.add("betopiaerp_waterfall", {
    match: (type) => type === "betopiaerp_waterfall",
    createChart: (definition, sheetId, getters) =>
        new BetopiaERPWaterfallChart(definition, sheetId, getters),
    getChartRuntime: createBetopiaERPChartRuntime,
    validateChartDefinition: (validator, definition) =>
        BetopiaERPWaterfallChart.validateChartDefinition(validator, definition),
    transformDefinition: (definition) => BetopiaERPWaterfallChart.transformDefinition(definition),
    getChartDefinitionFromContextCreation: () =>
        BetopiaERPWaterfallChart.getDefinitionFromContextCreation(),
    name: _t("Waterfall"),
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

    const chartJSData = getWaterfallDatasetAndLabels(definition, chartData);

    const config = {
        type: "bar",
        data: { labels: chartJSData.labels, datasets: chartJSData.datasets },
        options: {
            ...CHART_COMMON_OPTIONS,
            layout: getChartLayout(definition, chartData),
            scales: getWaterfallChartScales(definition, chartData),
            plugins: {
                title: getChartTitle(definition, getters),
                legend: getWaterfallChartLegend(definition, chartData),
                tooltip: getWaterfallChartTooltip(definition, chartData),
                chartShowValuesPlugin: getWaterfallChartShowValues(definition, chartData),
                waterfallLinesPlugin: { showConnectorLines: definition.showConnectorLines },
            },
            onHover: onBetopiaERPChartItemHover(),
            onClick: onWaterfallBetopiaERPChartItemClick(getters, chart),
        },
    };

    return { background, chartJsConfig: config };
}
