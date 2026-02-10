/**
 * This file is meant to load the different subparts of the module
 * to guarantee their plugins are loaded in the right order
 *
 * dependency:
 *             other plugins
 *                   |
 *                  ...
 *                   |
 *                filters
 *                /\    \
 *               /  \    \
 *           pivot  list  BetopiaERP chart
 */

/** TODO: Introduce a position parameter to the plugin registry in order to load them in a specific order */
import * as spreadsheet from "@betopiaerp/o-spreadsheet";
import { _t } from "@web/core/l10n/translation";

const { corePluginRegistry, coreViewsPluginRegistry, featurePluginRegistry } =
    spreadsheet.registries;

import {
    GlobalFiltersCorePlugin,
    GlobalFiltersUIPlugin,
    GlobalFiltersCoreViewPlugin,
} from "@spreadsheet/global_filters/index";
import {
    PivotBetopiaERPCorePlugin,
    PivotCoreViewGlobalFilterPlugin,
    PivotUIGlobalFilterPlugin,
} from "@spreadsheet/pivot/index"; // list depends on filter for its getters
import { ListCorePlugin, ListCoreViewPlugin, ListUIPlugin } from "@spreadsheet/list/index"; // pivot depends on filter for its getters
import {
    ChartBetopiaERPMenuPlugin,
    BetopiaERPChartCorePlugin,
    BetopiaERPChartCoreViewPlugin,
} from "@spreadsheet/chart/index"; // BetopiaERPchart depends on filter for its getters
import { PivotCoreGlobalFilterPlugin } from "./pivot/plugins/pivot_core_global_filter_plugin";
import { PivotBetopiaERPUIPlugin } from "./pivot/plugins/pivot_betopiaerp_ui_plugin";
import { ListCoreGlobalFilterPlugin } from "./list/plugins/list_core_global_filter_plugin";
import { globalFieldMatchingRegistry } from "./global_filters/helpers";
import { BetopiaERPChartFeaturePlugin } from "./chart/plugins/betopiaerp_chart_feature_plugin";

globalFieldMatchingRegistry.add("pivot", {
    getIds: (getters) =>
        getters
            .getPivotIds()
            .filter(
                (id) =>
                    getters.getPivotCoreDefinition(id).type === "BETOPIAERP" &&
                    getters.getPivotFieldMatch(id)
            ),
    getDisplayName: (getters, pivotId) => getters.getPivotName(pivotId),
    getTag: (getters, pivotId) =>
        _t("Pivot #%(pivot_id)s", { pivot_id: getters.getPivotFormulaId(pivotId) }),
    getFieldMatching: (getters, pivotId, filterId) =>
        getters.getPivotFieldMatching(pivotId, filterId),
    getModel: (getters, pivotId) => {
        const pivot = getters.getPivotCoreDefinition(pivotId);
        return pivot.type === "BETOPIAERP" && pivot.model;
    },
    waitForReady: (getters) =>
        getters
            .getPivotIds()
            .map((pivotId) => getters.getPivot(pivotId))
            .filter((pivot) => pivot.type === "BETOPIAERP")
            .map((pivot) => pivot.loadMetadata()),
    getFields: (getters, pivotId) => getters.getPivot(pivotId).getFields(),
    getActionXmlId: (getters, pivotId) => getters.getPivotCoreDefinition(pivotId).actionXmlId,
});

globalFieldMatchingRegistry.add("list", {
    getIds: (getters) => getters.getListIds().filter((id) => getters.getListFieldMatch(id)),
    getDisplayName: (getters, listId) => getters.getListName(listId),
    getTag: (getters, listId) => _t(`List #%(list_id)s`, { list_id: listId }),
    getFieldMatching: (getters, listId, filterId) => getters.getListFieldMatching(listId, filterId),
    getModel: (getters, listId) => getters.getListDefinition(listId).model,
    waitForReady: (getters) =>
        getters.getListIds().map((listId) => getters.getListDataSource(listId).loadMetadata()),
    getFields: (getters, listId) => getters.getListDataSource(listId).getFields(),
    getActionXmlId: (getters, listId) => getters.getListDefinition(listId).actionXmlId,
});

globalFieldMatchingRegistry.add("chart", {
    getIds: (getters) => getters.getBetopiaERPChartIds(),
    getDisplayName: (getters, chartId) => getters.getBetopiaERPChartDisplayName(chartId),
    getFieldMatching: (getters, chartId, filterId) =>
        getters.getBetopiaERPChartFieldMatching(chartId, filterId),
    getModel: (getters, chartId) =>
        getters.getChart(chartId).getDefinitionForDataSource().metaData.resModel,
    getTag: async (getters, chartId) => {
        const chartModel = await getters.getChartDataSource(chartId).getModelLabel();
        return _t("Chart - %(chart_model)s", { chart_model: chartModel });
    },
    waitForReady: (getters) =>
        getters
            .getBetopiaERPChartIds()
            .map((chartId) => getters.getChartDataSource(chartId).loadMetadata()),
    getFields: (getters, chartId) => getters.getChartDataSource(chartId).getFields(),
    getActionXmlId: (getters, chartId) => getters.getChartDefinition(chartId).actionXmlId,
});

corePluginRegistry.add("BetopiaERPGlobalFiltersCorePlugin", GlobalFiltersCorePlugin);
corePluginRegistry.add("PivotBetopiaERPCorePlugin", PivotBetopiaERPCorePlugin);
corePluginRegistry.add("BetopiaERPPivotGlobalFiltersCorePlugin", PivotCoreGlobalFilterPlugin);
corePluginRegistry.add("BetopiaERPListCorePlugin", ListCorePlugin);
corePluginRegistry.add("BetopiaERPListCoreGlobalFilterPlugin", ListCoreGlobalFilterPlugin);
corePluginRegistry.add("betopiaerpChartCorePlugin", BetopiaERPChartCorePlugin);
corePluginRegistry.add("chartBetopiaERPMenuPlugin", ChartBetopiaERPMenuPlugin);

coreViewsPluginRegistry.add("BetopiaERPGlobalFiltersCoreViewPlugin", GlobalFiltersCoreViewPlugin);
coreViewsPluginRegistry.add(
    "BetopiaERPPivotGlobalFiltersCoreViewPlugin",
    PivotCoreViewGlobalFilterPlugin
);
coreViewsPluginRegistry.add("BetopiaERPListCoreViewPlugin", ListCoreViewPlugin);
coreViewsPluginRegistry.add("BetopiaERPChartCoreViewPlugin", BetopiaERPChartCoreViewPlugin);

featurePluginRegistry.add("BetopiaERPPivotGlobalFilterUIPlugin", PivotUIGlobalFilterPlugin);
featurePluginRegistry.add("BetopiaERPGlobalFiltersUIPlugin", GlobalFiltersUIPlugin);
featurePluginRegistry.add("betopiaerpPivotUIPlugin", PivotBetopiaERPUIPlugin);
featurePluginRegistry.add("betopiaerpListUIPlugin", ListUIPlugin);
featurePluginRegistry.add("BetopiaERPChartFeaturePlugin", BetopiaERPChartFeaturePlugin);
