import * as spreadsheet from "@betopiaerp/o-spreadsheet";
import { BetopiaERPChartCorePlugin } from "./plugins/betopiaerp_chart_core_plugin";
import { ChartBetopiaERPMenuPlugin } from "./plugins/chart_betopiaerp_menu_plugin";
import { BetopiaERPChartCoreViewPlugin } from "./plugins/betopiaerp_chart_core_view_plugin";
import { _t } from "@web/core/l10n/translation";
import { chartBetopiaERPMenuPlugin } from "./betopiaerp_menu/betopiaerp_menu_chartjs_plugin";

const { chartComponentRegistry, chartSubtypeRegistry, chartJsExtensionRegistry } =
    spreadsheet.registries;
const { ChartJsComponent, ZoomableChartJsComponent } = spreadsheet.components;

chartComponentRegistry.add("betopiaerp_bar", ZoomableChartJsComponent);
chartComponentRegistry.add("betopiaerp_line", ZoomableChartJsComponent);
chartComponentRegistry.add("betopiaerp_pie", ChartJsComponent);
chartComponentRegistry.add("betopiaerp_radar", ChartJsComponent);
chartComponentRegistry.add("betopiaerp_sunburst", ChartJsComponent);
chartComponentRegistry.add("betopiaerp_treemap", ChartJsComponent);
chartComponentRegistry.add("betopiaerp_waterfall", ZoomableChartJsComponent);
chartComponentRegistry.add("betopiaerp_pyramid", ChartJsComponent);
chartComponentRegistry.add("betopiaerp_scatter", ZoomableChartJsComponent);
chartComponentRegistry.add("betopiaerp_combo", ZoomableChartJsComponent);
chartComponentRegistry.add("betopiaerp_geo", ChartJsComponent);
chartComponentRegistry.add("betopiaerp_funnel", ChartJsComponent);

chartSubtypeRegistry.add("betopiaerp_line", {
    matcher: (definition) =>
        definition.type === "betopiaerp_line" && !definition.stacked && !definition.fillArea,
    subtypeDefinition: { stacked: false, fillArea: false },
    displayName: _t("Line"),
    chartSubtype: "betopiaerp_line",
    chartType: "betopiaerp_line",
    category: "line",
    preview: "o-spreadsheet-ChartPreview.LINE_CHART",
});
chartSubtypeRegistry.add("betopiaerp_stacked_line", {
    matcher: (definition) =>
        definition.type === "betopiaerp_line" && definition.stacked && !definition.fillArea,
    subtypeDefinition: { stacked: true, fillArea: false },
    displayName: _t("Stacked Line"),
    chartSubtype: "betopiaerp_stacked_line",
    chartType: "betopiaerp_line",
    category: "line",
    preview: "o-spreadsheet-ChartPreview.STACKED_LINE_CHART",
});
chartSubtypeRegistry.add("betopiaerp_area", {
    matcher: (definition) =>
        definition.type === "betopiaerp_line" && !definition.stacked && definition.fillArea,
    subtypeDefinition: { stacked: false, fillArea: true },
    displayName: _t("Area"),
    chartSubtype: "betopiaerp_area",
    chartType: "betopiaerp_line",
    category: "area",
    preview: "o-spreadsheet-ChartPreview.AREA_CHART",
});
chartSubtypeRegistry.add("betopiaerp_stacked_area", {
    matcher: (definition) =>
        definition.type === "betopiaerp_line" && definition.stacked && definition.fillArea,
    subtypeDefinition: { stacked: true, fillArea: true },
    displayName: _t("Stacked Area"),
    chartSubtype: "betopiaerp_stacked_area",
    chartType: "betopiaerp_line",
    category: "area",
    preview: "o-spreadsheet-ChartPreview.STACKED_AREA_CHART",
});
chartSubtypeRegistry.add("betopiaerp_bar", {
    matcher: (definition) =>
        definition.type === "betopiaerp_bar" && !definition.stacked && !definition.horizontal,
    subtypeDefinition: { stacked: false, horizontal: false },
    displayName: _t("Column"),
    chartSubtype: "betopiaerp_bar",
    chartType: "betopiaerp_bar",
    category: "column",
    preview: "o-spreadsheet-ChartPreview.COLUMN_CHART",
});
chartSubtypeRegistry.add("betopiaerp_stacked_bar", {
    matcher: (definition) =>
        definition.type === "betopiaerp_bar" && definition.stacked && !definition.horizontal,
    subtypeDefinition: { stacked: true, horizontal: false },
    displayName: _t("Stacked Column"),
    chartSubtype: "betopiaerp_stacked_bar",
    chartType: "betopiaerp_bar",
    category: "column",
    preview: "o-spreadsheet-ChartPreview.STACKED_COLUMN_CHART",
});
chartSubtypeRegistry.add("betopiaerp_horizontal_bar", {
    matcher: (definition) =>
        definition.type === "betopiaerp_bar" && !definition.stacked && definition.horizontal,
    subtypeDefinition: { stacked: false, horizontal: true },
    displayName: _t("Bar"),
    chartSubtype: "betopiaerp_horizontal_bar",
    chartType: "betopiaerp_bar",
    category: "bar",
    preview: "o-spreadsheet-ChartPreview.BAR_CHART",
});
chartSubtypeRegistry.add("betopiaerp_horizontal_stacked_bar", {
    matcher: (definition) =>
        definition.type === "betopiaerp_bar" && definition.stacked && definition.horizontal,
    subtypeDefinition: { stacked: true, horizontal: true },
    displayName: _t("Stacked Bar"),
    chartSubtype: "betopiaerp_horizontal_stacked_bar",
    chartType: "betopiaerp_bar",
    category: "bar",
    preview: "o-spreadsheet-ChartPreview.STACKED_BAR_CHART",
});
chartSubtypeRegistry.add("betopiaerp_combo", {
    displayName: _t("Combo"),
    chartSubtype: "betopiaerp_combo",
    chartType: "betopiaerp_combo",
    category: "line",
    preview: "o-spreadsheet-ChartPreview.COMBO_CHART",
});
chartSubtypeRegistry.add("betopiaerp_pie", {
    displayName: _t("Pie"),
    matcher: (definition) => definition.type === "betopiaerp_pie" && !definition.isDoughnut,
    subtypeDefinition: { isDoughnut: false },
    chartSubtype: "betopiaerp_pie",
    chartType: "betopiaerp_pie",
    category: "pie",
    preview: "o-spreadsheet-ChartPreview.PIE_CHART",
});
chartSubtypeRegistry.add("betopiaerp_doughnut", {
    matcher: (definition) => definition.type === "betopiaerp_pie" && definition.isDoughnut,
    subtypeDefinition: { isDoughnut: true },
    displayName: _t("Doughnut"),
    chartSubtype: "betopiaerp_doughnut",
    chartType: "betopiaerp_pie",
    category: "pie",
    preview: "o-spreadsheet-ChartPreview.DOUGHNUT_CHART",
});
chartSubtypeRegistry.add("betopiaerp_scatter", {
    displayName: _t("Scatter"),
    chartType: "betopiaerp_scatter",
    chartSubtype: "betopiaerp_scatter",
    category: "misc",
    preview: "o-spreadsheet-ChartPreview.SCATTER_CHART",
});
chartSubtypeRegistry.add("betopiaerp_waterfall", {
    displayName: _t("Waterfall"),
    chartSubtype: "betopiaerp_waterfall",
    chartType: "betopiaerp_waterfall",
    category: "misc",
    preview: "o-spreadsheet-ChartPreview.WATERFALL_CHART",
});
chartSubtypeRegistry.add("betopiaerp_pyramid", {
    displayName: _t("Population Pyramid"),
    chartSubtype: "betopiaerp_pyramid",
    chartType: "betopiaerp_pyramid",
    category: "misc",
    preview: "o-spreadsheet-ChartPreview.POPULATION_PYRAMID_CHART",
});
chartSubtypeRegistry.add("betopiaerp_radar", {
    matcher: (definition) => definition.type === "betopiaerp_radar" && !definition.fillArea,
    displayName: _t("Radar"),
    chartSubtype: "betopiaerp_radar",
    chartType: "betopiaerp_radar",
    subtypeDefinition: { fillArea: false },
    category: "misc",
    preview: "o-spreadsheet-ChartPreview.RADAR_CHART",
});
chartSubtypeRegistry.add("betopiaerp_filled_radar", {
    matcher: (definition) => definition.type === "betopiaerp_radar" && !!definition.fillArea,
    displayName: _t("Filled Radar"),
    chartType: "betopiaerp_radar",
    chartSubtype: "betopiaerp_filled_radar",
    subtypeDefinition: { fillArea: true },
    category: "misc",
    preview: "o-spreadsheet-ChartPreview.FILLED_RADAR_CHART",
});
chartSubtypeRegistry.add("betopiaerp_geo", {
    displayName: _t("Geo chart"),
    chartType: "betopiaerp_geo",
    chartSubtype: "betopiaerp_geo",
    category: "misc",
    preview: "o-spreadsheet-ChartPreview.GEO_CHART",
});
chartSubtypeRegistry.add("betopiaerp_funnel", {
    matcher: (definition) => definition.type === "betopiaerp_funnel",
    displayName: _t("Funnel"),
    chartType: "betopiaerp_funnel",
    chartSubtype: "betopiaerp_funnel",
    subtypeDefinition: { cumulative: true },
    category: "misc",
    preview: "o-spreadsheet-ChartPreview.FUNNEL_CHART",
});
chartSubtypeRegistry.add("betopiaerp_treemap", {
    displayName: _t("Treemap"),
    chartType: "betopiaerp_treemap",
    chartSubtype: "betopiaerp_treemap",
    category: "hierarchical",
    preview: "o-spreadsheet-ChartPreview.TREE_MAP_CHART",
});
chartSubtypeRegistry.add("betopiaerp_sunburst", {
    displayName: _t("Sunburst"),
    chartType: "betopiaerp_sunburst",
    chartSubtype: "betopiaerp_sunburst",
    category: "hierarchical",
    preview: "o-spreadsheet-ChartPreview.SUNBURST_CHART",
});

chartJsExtensionRegistry.add("chartBetopiaERPMenuPlugin", {
    register: (Chart) => Chart.register(chartBetopiaERPMenuPlugin),
    unregister: (Chart) => Chart.unregister(chartBetopiaERPMenuPlugin),
});

export { BetopiaERPChartCorePlugin, ChartBetopiaERPMenuPlugin, BetopiaERPChartCoreViewPlugin };
