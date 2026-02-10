# -*- coding: utf-8 -*-

from odoo import api, SUPERUSER_ID


BRAND_PARAM = "betopia.brand_name"


def post_init_hook(cr, registry):
    env = api.Environment(cr, SUPERUSER_ID, {})
    brand = env["ir.config_parameter"].sudo().get_param(BRAND_PARAM, "BetopiaERP")

    companies = env["res.company"].sudo().search([])
    for company in companies:
        footer = company.report_footer or ""
        if not footer:
            company.report_footer = f"Powered by {brand}"
            continue
        if "Odoo" in footer:
            company.report_footer = footer.replace("Odoo", brand)
