# -*- coding: utf-8 -*-
"""Module providing migration to folderish posts"""
from Acquisition import aq_inner
from Products.CMFCore.interfaces import IContentish
from five import grok
from plone import api
from zope.lifecycleevent import modified

from meetshaus.blog.blogentry import IBlogEntry
from meetshaus.blog import MessageFactory as _


class FolderishPostMigration(grok.View):
    grok.context(IContentish)
    grok.require('cmf.ManagePortal')
    grok.name('migrate-to-folderish')

    def render(self):
        context = aq_inner(self.context)
        next_url = context.absolute_url()
        created_idx = self._create_posts()
        msg = _(u"{0} new postings created".format(created_idx))
        api.portal.show_message(message=msg, request=self.request)
        return self.request.response.redirect(next_url)

    def _create_posts(self):
        context = aq_inner(self.context)
        idx = 0
        fields = ('description', 'text', 'subject', 'effective')
        catalog = api.portal.gat_tool(name='portal_catalog')
        items = catalog(object_provides=IBlogEntry.__identifier__,)
        for item in items:
            # create new postings here
            container = context
            obj = api.content.create(
                type='Document',
                title=item.Title(),
                container=container
            )
            for value in fields:
                old = getattr(item, value, '')
                setattr(obj, value, old)
            modified(obj)
            obj.reindexObject(idxs='modified')
            idx += 1
        return idx
