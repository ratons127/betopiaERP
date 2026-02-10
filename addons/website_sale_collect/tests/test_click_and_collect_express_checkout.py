# Part of BetopiaERP. See LICENSE file for full copyright and licensing details.

from betopiaerp.tests import tagged

from betopiaerp.addons.website_sale_collect.controllers.delivery import InStoreDelivery
from betopiaerp.addons.website_sale_collect.tests.common import ClickAndCollectCommon


@tagged('post_install', '-at_install')
class TestClickAndCollectExpressCheckout(ClickAndCollectCommon):

    def test_exclude_in_store_delivery_methods(self):
        express_delivery_methods = InStoreDelivery._get_delivery_methods_express_checkout(self.cart)

        self.assertNotIn(self.in_store_dm, express_delivery_methods)
