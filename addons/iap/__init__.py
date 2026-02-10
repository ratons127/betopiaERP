# -*- coding: utf-8 -*-
# Part of BetopiaERP. See LICENSE file for full copyright and licensing details.

from . import models
from . import tools

# compatibility imports
from betopiaerp.addons.iap.tools.iap_tools import iap_jsonrpc as jsonrpc
from betopiaerp.addons.iap.tools.iap_tools import InsufficientCreditError
