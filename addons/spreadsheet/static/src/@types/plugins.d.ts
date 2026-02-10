declare module "@spreadsheet" {
    import { CommandResult, CorePlugin, UIPlugin } from "@betopiaerp/o-spreadsheet";
    import { CommandResult as CR } from "@spreadsheet/o_spreadsheet/cancelled_reason";
    type BetopiaERPCommandResult = CommandResult | typeof CR;

    export interface BetopiaERPCorePlugin extends CorePlugin {
        getters: BetopiaERPCoreGetters;
        dispatch: BetopiaERPCoreDispatch;
        allowDispatch(command: AllCoreCommand): string | string[];
        beforeHandle(command: AllCoreCommand): void;
        handle(command: AllCoreCommand): void;
    }

    export interface BetopiaERPCorePluginConstructor {
        new (config: unknown): BetopiaERPCorePlugin;
    }

    export interface BetopiaERPUIPlugin extends UIPlugin {
        getters: BetopiaERPGetters;
        dispatch: BetopiaERPDispatch;
        allowDispatch(command: AllCommand): string | string[];
        beforeHandle(command: AllCommand): void;
        handle(command: AllCommand): void;
    }

    export interface BetopiaERPUIPluginConstructor {
        new (config: unknown): BetopiaERPUIPlugin;
    }
}
