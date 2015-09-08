from five import grok
from Acquisition import aq_inner
import transaction
from Products.CMFCore.interfaces import IContentish

from zope.component import getUtility
from plone.registry.interfaces import IRegistry
from plone.registry.record import Record
from plone.registry import field


class RegistryCleanup(grok.View):
    grok.context(IContentish)
    grok.require('cmf.ManagePortal')
    grok.name('cleanup-registry-records')

    def render(self):
        """ Heper method to set registry values - should only be run once! """
        context = aq_inner(self.context)
        registry = getUtility(IRegistry)
        del registry.records['collective.xdv.interfaces.ITransformSettings.absolute_prefix']
        del registry.records['collective.xdv.interfaces.ITransformSettings.alternate_themes']
        del registry.records['collective.xdv.interfaces.ITransformSettings.domains']
        del registry.records['collective.xdv.interfaces.ITransformSettings.enabled']
        del registry.records['collective.xdv.interfaces.ITransformSettings.extraurl']
        del registry.records['collective.xdv.interfaces.ITransformSettings.notheme']
        del registry.records['collective.xdv.interfaces.ITransformSettings.read_network']
        del registry.records['collective.xdv.interfaces.ITransformSettings.rules']
        del registry.records['collective.xdv.interfaces.ITransformSettings.theme']
        registry.records['plone.app.discussion.interfaces.IDiscussionSettings.moderation_enabled'] = Record(field.Bool(title=u"Moderation Enabled"), False)
        registry.records['plone.app.discussion.interfaces.IDiscussionSettings.moderator_email'] = Record(field.TextLine(title=u"Moderator Email"), u"")
        transaction.savepoint()
        return 'Successfully fixed the registry settings.'
