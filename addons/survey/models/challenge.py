# -*- coding: utf-8 -*-
# Part of BetopiaERP. See LICENSE file for full copyright and licensing details.

from betopiaerp import models, fields


class GamificationChallenge(models.Model):
    _inherit = 'gamification.challenge'

    challenge_category = fields.Selection(selection_add=[
        ('certification', 'Certifications')
    ], ondelete={'certification': 'set default'})
