# Part of BetopiaERP. See LICENSE file for full copyright and licensing details.

from betopiaerp import models, fields


# We add a field on this model
class TestUnit(models.Model):
    _inherit = 'test.unit'

    second_name = fields.Char()
