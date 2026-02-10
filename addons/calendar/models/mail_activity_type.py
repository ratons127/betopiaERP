# Part of BetopiaERP. See LICENSE file for full copyright and licensing details.

from betopiaerp import models, fields


class MailActivityType(models.Model):
    _inherit = "mail.activity.type"

    category = fields.Selection(selection_add=[('meeting', 'Meeting')])
