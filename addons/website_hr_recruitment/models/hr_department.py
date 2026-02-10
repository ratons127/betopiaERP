# Part of BetopiaERP. See LICENSE file for full copyright and licensing details.

from betopiaerp import models, fields


class HrDepartment(models.Model):
    _inherit = 'hr.department'

    # Get department name using superuser, because model is not accessible for portal users
    display_name = fields.Char(compute_sudo=True)
