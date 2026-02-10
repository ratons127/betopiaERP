import { animationFrame } from "@betopiaerp/hoot-mock";

import * as spreadsheet from "@betopiaerp/o-spreadsheet";
import { createModelWithDataSource } from "@spreadsheet/../tests/helpers/model";
const uuidGenerator = new spreadsheet.helpers.UuidGenerator();

/**
 * @typedef {import("@betopiaerp/o-spreadsheet").Model} Model
 * @typedef {import("@spreadsheet").BetopiaERPSpreadsheetModel} BetopiaERPSpreadsheetModel
 */

/**
 *
 * @param {Model} model
 * @param {string} type
 * @param {import("@spreadsheet/chart/betopiaerp_chart/betopiaerp_chart").BetopiaERPChartDefinition} definition
 */
export function insertChartInSpreadsheet(model, type = "betopiaerp_bar", definition = {}) {
    definition = { ...getChartDefinition(type), ...definition };
    model.dispatch("CREATE_CHART", {
        sheetId: model.getters.getActiveSheetId(),
        chartId: definition.id,
        figureId: uuidGenerator.smallUuid(),
        col: 0,
        row: 0,
        offset: {
            x: 10,
            y: 10,
        },
        definition,
    });
    return definition.id;
}
/**
 *
 * @param {Object} params
 * @param {function} [params.definition]
 * @param {function} [params.mockRPC]
 * @param {string} [params.type]
 * @param {import("./data").ServerData} [params.serverData]
 *
 * @returns { Promise<{ model: BetopiaERPSpreadsheetModel, env: Object }>}
 */
export async function createSpreadsheetWithChart(params = {}) {
    const { model, env } = await createModelWithDataSource(params);

    insertChartInSpreadsheet(model, params.type, params.definition);

    await animationFrame();
    return { model, env };
}

function getChartDefinition(type) {
    return {
        metaData: {
            groupBy: ["foo", "bar"],
            measure: "__count",
            order: null,
            resModel: "partner",
        },
        searchParams: {
            comparison: null,
            context: {},
            domain: [],
            groupBy: [],
            orderBy: [],
        },
        stacked: true,
        title: { text: "Partners" },
        background: "#FFFFFF",
        legendPosition: "top",
        verticalAxisPosition: "left",
        dataSourceId: uuidGenerator.smallUuid(),
        id: uuidGenerator.smallUuid(),
        type,
    };
}
