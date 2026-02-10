# Part of BetopiaERP. See LICENSE file for full copyright and licensing details.

from betopiaerp import fields, models


class MrpBom(models.Model):
    _inherit = 'mrp.bom'

    project_id = fields.Many2one('project.project', domain=[('is_template', '=', False)])
