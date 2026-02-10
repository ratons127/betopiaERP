# -*- coding: utf-8 -*-
# Part of BetopiaERP. See LICENSE file for full copyright and licensing details.

import betopiaerp.tests
from betopiaerp.tools import mute_logger


@betopiaerp.tests.common.tagged('post_install', '-at_install')
class TestCustomSnippet(betopiaerp.tests.HttpCase):

    @mute_logger('betopiaerp.addons.http_routing.models.ir_http', 'betopiaerp.http')
    def test_01_run_tour(self):
        self.start_tour(self.env['website'].get_client_action_url('/'), 'test_custom_snippet', login="admin")
