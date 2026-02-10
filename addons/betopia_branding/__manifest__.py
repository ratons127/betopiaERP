# -*- coding: utf-8 -*-
{
    "name": "BetopiaERP Branding",
    "version": "19.0.1.0.0",
    "summary": "BetopiaERP branding for UI, login, and report headers",
    "category": "Tools",
    "license": "LGPL-3",
    "author": "BetopiaERP",
    "depends": ["web", "portal"],
    "data": [
        "data/ir_config_parameter.xml",
        "views/branding_templates.xml",
    ],
    "post_init_hook": "post_init_hook",
    "installable": True,
    "application": False,
}
