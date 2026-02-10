import { describe, expect, test } from "@betopiaerp/hoot";
import { animationFrame } from "@betopiaerp/hoot-dom";
import { Model, components } from "@betopiaerp/o-spreadsheet";
import { createBasicChart } from "@spreadsheet/../tests/helpers/commands";
import { makeSpreadsheetMockEnv } from "@spreadsheet/../tests/helpers/model";
import { BetopiaERPDataProvider } from "@spreadsheet/data_sources/betopiaerp_data_provider";
import { createDashboardActionWithData } from "@spreadsheet_dashboard/../tests/helpers/dashboard_action";
import { defineSpreadsheetDashboardModels } from "@spreadsheet_dashboard/../tests/helpers/data";
import { patchWithCleanup } from "@web/../tests/web_test_helpers";

describe.current.tags("desktop");
defineSpreadsheetDashboardModels();

function spyCharts() {
    const charts = {};
    patchWithCleanup(components.ChartJsComponent.prototype, {
        createChart(chartData) {
            super.createChart(chartData);
            charts[this.props.chartId] = this.chart;
        },
    });
    return charts;
}

test("Charts are animated only at first render", async () => {
    const env = await makeSpreadsheetMockEnv();
    const setupModel = new Model({}, { custom: { betopiaerpDataProvider: new BetopiaERPDataProvider(env) } });
    createBasicChart(setupModel, "chartId");
    const charts = spyCharts();
    const { model } = await createDashboardActionWithData(setupModel.exportData());

    expect(".o-figure").toHaveCount(1);
    expect(charts["chartId"].config.options.animation.animateRotate).toBe(true);

    // Scroll the figure out of the viewport and back in
    model.dispatch("SET_VIEWPORT_OFFSET", { offsetX: 0, offsetY: 500 });
    await animationFrame();
    await animationFrame();
    expect(".o-figure").toHaveCount(0);

    model.dispatch("SET_VIEWPORT_OFFSET", { offsetX: 0, offsetY: 0 });
    await animationFrame();
    expect(".o-figure").toHaveCount(1);
    expect(charts["chartId"].config.options.animation).toBe(false);
});

test("Charts are animated when chart type changes", async () => {
    const env = await makeSpreadsheetMockEnv();
    const setupModel = new Model({}, { custom: { betopiaerpDataProvider: new BetopiaERPDataProvider(env) } });
    createBasicChart(setupModel, "chartId");
    const charts = spyCharts();
    const { model } = await createDashboardActionWithData(setupModel.exportData());

    expect(".o-figure").toHaveCount(1);
    expect(charts["chartId"].config.options.animation.animateRotate).toBe(true);
    delete charts["chartId"];

    const definition = model.getters.getChartDefinition("chartId");
    model.dispatch("UPDATE_CHART", {
        definition: { ...definition, type: "pie" },
        chartId: "chartId",
        figureId: model.getters.getFigureIdFromChartId("chartId"),
        sheetId: model.getters.getActiveSheetId(),
    });
    await animationFrame();

    expect(charts["chartId"].config.options.animation.animateRotate).toBe(true);
});
