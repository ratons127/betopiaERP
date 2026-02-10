# Part of BetopiaERP. See LICENSE file for full copyright and licensing details.
from betopiaerp import fields, models


class AccountMove(models.Model):
    _inherit = 'account.move'

    l10n_vn_e_invoice_number = fields.Char(
        string='eInvoice Number',
        help='Electronic Invoicing number.',
        copy=False,
    )
