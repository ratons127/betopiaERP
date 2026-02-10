// @ts-check

import { helpers } from "@betopiaerp/o-spreadsheet";

const { getFunctionsFromTokens } = helpers;

/**
 * @typedef {import("@betopiaerp/o-spreadsheet").Token} Token
 * @typedef  {import("@spreadsheet/helpers/betopiaerp_functions_helpers").BetopiaERPFunctionDescription} BetopiaERPFunctionDescription
 */

/**
 * @param {Token[]} tokens
 * @returns {number}
 */
export function getNumberOfAccountFormulas(tokens) {
    return getFunctionsFromTokens(tokens, ["BETOPIAERP.BALANCE", "BETOPIAERP.CREDIT", "BETOPIAERP.DEBIT", "BETOPIAERP.RESIDUAL", "BETOPIAERP.PARTNER.BALANCE", "BETOPIAERP.BALANCE.TAG"]).length;
}

/**
 * Get the first Account function description of the given formula.
 *
 * @param {Token[]} tokens
 * @returns {BetopiaERPFunctionDescription | undefined}
 */
export function getFirstAccountFunction(tokens) {
    return getFunctionsFromTokens(tokens, ["BETOPIAERP.BALANCE", "BETOPIAERP.CREDIT", "BETOPIAERP.DEBIT", "BETOPIAERP.RESIDUAL", "BETOPIAERP.PARTNER.BALANCE", "BETOPIAERP.BALANCE.TAG"])[0];
}
