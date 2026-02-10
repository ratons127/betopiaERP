# -*- coding: utf-8 -*-

from betopiaerp.modules.registry import Registry

def migrate(cr, version):
    registry = Registry(cr.dbname)
    from betopiaerp.addons.account.models.chart_template import migrate_set_tags_and_taxes_updatable
    migrate_set_tags_and_taxes_updatable(cr, registry, 'l10n_nl')
