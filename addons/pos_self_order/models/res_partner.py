# Part of BetopiaERP. See LICENSE file for full copyright and licensing details.
from betopiaerp import api, models


class ResPartner(models.Model):
    _inherit = 'res.partner'

    @api.model
    def _load_pos_self_data_domain(self, data, config):
        return False
