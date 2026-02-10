# -*- coding: utf-8 -*-
# Part of BetopiaERP. See LICENSE file for full copyright and licensing details.

{
    'name': 'BetopiaERPBot',
    'version': '1.2',
    'category': 'Productivity/Discuss',
    'summary': 'Add BetopiaERPBot in discussions',
    'website': 'https://www.BetopiaERP.com/app/discuss',
    'depends': ['mail'],
    'auto_install': True,
    'installable': True,
    'data': [
        'views/res_users_views.xml',
        'data/mailbot_data.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'mail_bot/static/src/scss/betopiaerpbot_style.scss',
        ],
    },
    'author': 'BetopiaERP',
    'license': 'LGPL-3',
}
