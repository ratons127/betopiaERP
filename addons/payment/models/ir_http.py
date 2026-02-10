# Part of BetopiaERP. See LICENSE file for full copyright and licensing details.

from betopiaerp import models


class IrHttp(models.AbstractModel):
    _inherit = 'ir.http'

    @classmethod
    def _get_translation_frontend_modules_name(cls):
        mods = super()._get_translation_frontend_modules_name()
        return mods + ['payment']
