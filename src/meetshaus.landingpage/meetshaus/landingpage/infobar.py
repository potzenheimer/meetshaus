from five import grok
from zope.interface import Interface
from zope.component import getMultiAdapter
from Acquisition import aq_inner

from plone.app.layout.viewlets.interfaces import IPortalFooter


class InfoBarViewlet(grok.Viewlet):
    grok.name('fd.sitecontent.InfoBarViewlet')
    grok.context(Interface)
    grok.require('zope2.View')
    grok.viewletmanager(IPortalFooter)

    def update(self):
        context = aq_inner(self.context)
        pstate = getMultiAdapter((context, self.request),
                                 name="plone_portal_state")
        self.portal_url = pstate.portal_url()
        self.context_url = context.absolute_url()
