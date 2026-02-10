import betopiaerp.tests
from betopiaerp.tools import mute_logger


@betopiaerp.tests.common.tagged('post_install', '-at_install')
class TestWebsiteError(betopiaerp.tests.HttpCase):

    @mute_logger('betopiaerp.addons.http_routing.models.ir_http', 'betopiaerp.http')
    def test_01_run_test(self):
        self.start_tour("/test_error_view", 'test_error_website')
