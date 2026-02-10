# Part of BetopiaERP. See LICENSE file for full copyright and licensing details.

from betopiaerp import fields, models, api, _


class UomUom(models.Model):
    _inherit = 'uom.uom'

    l10n_cl_sii_code = fields.Char('SII Code')
