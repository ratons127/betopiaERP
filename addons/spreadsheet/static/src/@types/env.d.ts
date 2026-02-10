import { SpreadsheetChildEnv as SSChildEnv } from "@betopiaerp/o-spreadsheet";
import { Services } from "services";

declare module "@spreadsheet" {
    import { Model } from "@betopiaerp/o-spreadsheet";

    export interface SpreadsheetChildEnv extends SSChildEnv {
        model: BetopiaERPSpreadsheetModel;
        services: Services;
    }
}
