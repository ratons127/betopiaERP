import { CorePlugin, CoreViewPlugin, UIPlugin } from "@betopiaerp/o-spreadsheet";

/**
 * An o-spreadsheet core plugin with access to all custom BetopiaERP plugins
 * @type {import("@spreadsheet").BetopiaERPCorePluginConstructor}
 **/
export const BetopiaERPCorePlugin = CorePlugin;

/**
 * An o-spreadsheet CoreView plugin with access to all custom BetopiaERP plugins
 * @type {import("@spreadsheet").BetopiaERPUIPluginConstructor}
 **/
export const BetopiaERPCoreViewPlugin = CoreViewPlugin;

/**
 * An o-spreadsheet UI plugin with access to all custom BetopiaERP plugins
 * @type {import("@spreadsheet").BetopiaERPUIPluginConstructor}
 **/
export const BetopiaERPUIPlugin = UIPlugin;
