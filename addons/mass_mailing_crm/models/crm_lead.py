# -*- coding: utf-8 -*-
# Part of BetopiaERP. See LICENSE file for full copyright and licensing details.

from betopiaerp import models


class CrmLead(models.Model):
    _inherit = 'crm.lead'
    _mailing_enabled = True
