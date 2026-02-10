# -*- coding: utf-8 -*-

from betopiaerp import api, fields, models


class ResUsersLog(models.Model):
    _inherit = 'res.users.log'

    ip = fields.Char(string="IP Address")
