import { KanbanController } from "@web/views/kanban/kanban_controller";
import { EventBus, useSubEnv } from "@betopiaerp/owl";

export class TimeOffKanbanController extends KanbanController {
    setup() {
        super.setup();
        useSubEnv({
            timeOffBus: new EventBus(),
        });
    }

    afterExecuteActionButton(clickParams) {
        super.afterExecuteActionButton(clickParams);
        this.env.timeOffBus.trigger("update_dashboard");
    }
}
