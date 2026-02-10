declare module "@spreadsheet" {
    import { Model } from "@betopiaerp/o-spreadsheet";

    export interface BetopiaERPSpreadsheetModel extends Model {
        getters: BetopiaERPGetters;
        dispatch: BetopiaERPDispatch;
    }

    export interface BetopiaERPSpreadsheetModelConstructor {
        new (
            data: object,
            config: Partial<Model["config"]>,
            revisions: object[]
        ): BetopiaERPSpreadsheetModel;
    }
}
