from betopiaerp.tests import tagged
from betopiaerp.addons.website.tests.test_website_technical_page import TestWebsiteTechnicalPage


@tagged("post_install", "-at_install")
class TestWebsiteMailGroupTechnicalPage(TestWebsiteTechnicalPage):

    def test_load_website_mail_group_technical_pages(self):
        self._validate_routes(["/groups"])
