// @ts-check

import { helpers } from "@betopiaerp/o-spreadsheet";

const { getFunctionsFromTokens } = helpers;

/** @typedef {import("@betopiaerp/o-spreadsheet").Token} Token */

/**
 * Parse a spreadsheet formula and detect the number of LIST functions that are
 * present in the given formula.
 *
 * @param {Token[]} tokens
 *
 * @returns {number}
 */
export function getNumberOfListFormulas(tokens) {
    return getFunctionsFromTokens(tokens, ["BETOPIAERP.LIST", "BETOPIAERP.LIST.HEADER"]).length;
}

/**
 * Get the first List function description of the given formula.
 *
 * @param {Token[]} tokens
 *
 * @returns {import("../helpers/betopiaerp_functions_helpers").BetopiaERPFunctionDescription|undefined}
 */
export function getFirstListFunction(tokens) {
    return getFunctionsFromTokens(tokens, ["BETOPIAERP.LIST", "BETOPIAERP.LIST.HEADER"])[0];
}
