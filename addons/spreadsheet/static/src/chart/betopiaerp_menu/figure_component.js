import { patch } from "@web/core/utils/patch";
import * as spreadsheet from "@betopiaerp/o-spreadsheet";
import { useService } from "@web/core/utils/hooks";
import { navigateToBetopiaERPMenu } from "../betopiaerp_chart/betopiaerp_chart_helpers";

patch(spreadsheet.components.FigureComponent.prototype, {
    setup() {
        super.setup();
        this.actionService = useService("action");
        this.notificationService = useService("notification");
    },
    get chartId() {
        if (this.props.figureUI.tag !== "chart" && this.props.figureUI.tag !== "carousel") {
            return undefined;
        }
        return this.env.model.getters.getChartIdFromFigureId(this.props.figureUI.id);
    },
    async navigateToBetopiaERPMenu(newWindow) {
        const menu = this.env.model.getters.getChartBetopiaERPMenu(this.chartId);
        await navigateToBetopiaERPMenu(menu, this.actionService, this.notificationService, newWindow);
    },
    get hasBetopiaERPMenu() {
        return this.chartId && this.env.model.getters.getChartBetopiaERPMenu(this.chartId) !== undefined;
    },
});

patch(spreadsheet.components.ScorecardChart.prototype, {
    setup() {
        super.setup();
        this.actionService = useService("action");
        this.notificationService = useService("notification");
    },
    async navigateToBetopiaERPMenu(newWindow) {
        const menu = this.env.model.getters.getChartBetopiaERPMenu(this.props.chartId);
        await navigateToBetopiaERPMenu(menu, this.actionService, this.notificationService, newWindow);
    },
    get hasBetopiaERPMenu() {
        return this.env.model.getters.getChartBetopiaERPMenu(this.props.chartId) !== undefined;
    },
    async onClick() {
        if (this.env.isDashboard() && this.hasBetopiaERPMenu) {
            await this.navigateToBetopiaERPMenu();
        }
    },
});

patch(spreadsheet.components.GaugeChartComponent.prototype, {
    setup() {
        super.setup();
        this.actionService = useService("action");
        this.notificationService = useService("notification");
    },
    async navigateToBetopiaERPMenu(newWindow) {
        const menu = this.env.model.getters.getChartBetopiaERPMenu(this.props.chartId);
        await navigateToBetopiaERPMenu(menu, this.actionService, this.notificationService, newWindow);
    },
    get hasBetopiaERPMenu() {
        return this.env.model.getters.getChartBetopiaERPMenu(this.props.chartId) !== undefined;
    },
    async onClick() {
        if (this.env.isDashboard() && this.hasBetopiaERPMenu) {
            await this.navigateToBetopiaERPMenu();
        }
    },
});
