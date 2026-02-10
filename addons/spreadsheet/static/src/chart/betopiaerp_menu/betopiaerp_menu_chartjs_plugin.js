import {
    navigateToBetopiaERPMenu,
    isChartJSMiddleClick,
} from "@spreadsheet/chart/betopiaerp_chart/betopiaerp_chart_helpers";

export const chartBetopiaERPMenuPlugin = {
    id: "chartBetopiaERPMenuPlugin",
    afterEvent(chart, { event }, { env, menu }) {
        const isDashboard = env?.model.getters.isDashboard();
        event.native.target.style.cursor = menu && isDashboard ? "pointer" : "";

        const middleClick = isChartJSMiddleClick(event);
        if (
            (event.type !== "click" && !middleClick) ||
            !menu ||
            !isDashboard ||
            event.native.defaultPrevented
        ) {
            return;
        }
        navigateToBetopiaERPMenu(menu, env.services.action, env.services.notification, middleClick);
    },
};
