import { BetopiaERPCorePlugin } from "@spreadsheet/plugins";
import { coreTypes, constants } from "@betopiaerp/o-spreadsheet";
const { FIGURE_ID_SPLITTER } = constants;

/** Plugin that link charts with BetopiaERP menus. It can contain either the Id of the betopiaerp menu, or its xml id. */
export class ChartBetopiaERPMenuPlugin extends BetopiaERPCorePlugin {
    static getters = /** @type {const} */ (["getChartBetopiaERPMenu"]);
    constructor(config) {
        super(config);
        this.betopiaerpMenuReference = {};
    }

    /**
     * Handle a spreadsheet command
     * @param {Object} cmd Command
     */
    handle(cmd) {
        switch (cmd.type) {
            case "LINK_BETOPIAERP_MENU_TO_CHART":
                this.history.update("betopiaerpMenuReference", cmd.chartId, cmd.betopiaerpMenuId);
                break;
            case "DELETE_CHART":
                this.history.update("betopiaerpMenuReference", cmd.chartId, undefined);
                break;
            case "DUPLICATE_SHEET":
                this.updateOnDuplicateSheet(cmd.sheetId, cmd.sheetIdTo);
                break;
        }
    }

    updateOnDuplicateSheet(sheetIdFrom, sheetIdTo) {
        for (const oldChartId of this.getters.getChartIds(sheetIdFrom)) {
            const menu = this.betopiaerpMenuReference[oldChartId];
            if (!menu) {
                continue;
            }
            const chartIdBase = oldChartId.split(FIGURE_ID_SPLITTER).pop();
            const newChartId = `${sheetIdTo}${FIGURE_ID_SPLITTER}${chartIdBase}`;
            this.history.update("betopiaerpMenuReference", newChartId, menu);
        }
    }

    /**
     * Get betopiaerp menu linked to the chart
     *
     * @param {string} chartId
     * @returns {object | undefined}
     */
    getChartBetopiaERPMenu(chartId) {
        const menuId = this.betopiaerpMenuReference[chartId];
        return menuId ? this.getters.getIrMenu(menuId) : undefined;
    }

    import(data) {
        if (data.chartBetopiaERPMenusReferences) {
            this.betopiaerpMenuReference = data.chartBetopiaERPMenusReferences;
        }
    }

    export(data) {
        data.chartBetopiaERPMenusReferences = this.betopiaerpMenuReference;
    }
}

coreTypes.add("LINK_BETOPIAERP_MENU_TO_CHART");
