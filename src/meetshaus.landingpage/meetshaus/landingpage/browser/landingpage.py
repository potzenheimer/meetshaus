# -*- coding: UTF-8 -*-
""" Module providing landing pages """

from five import grok
from plone import api

from plone.app.contentlisting.interfaces import IContentListing

from meetshaus.blog.blogentry import IBlogEntry
from meetshaus.landingpage.content.landingpage import ILandingPage


class View(grok.View):
    grok.context(ILandingPage)
    grok.require('zope2.View')
    grok.name('view')

    def update(self):
        self.has_blogentries = len(self.blogentries()) > 0
        self.portal_url = api.portal.get().absolute_url()

    def blogentries(self):
        catalog = api.portal.get_tool(name='portal_catalog')
        items = catalog(object_provides=IBlogEntry.__identifier__,
                        review_state='published',
                        sort_on='effective',
                        sort_order='reverse',
                        limit=3)[:3]
        results = IContentListing(items)
        return results

    def latest_blogentry(self):
        return self.blogentries()[0]

    def _readable_text(self, uid):
        context = api.content.get(UID=uid)
        meta = context.title + ' ' + context.description
        if context.text:
            html = context.text.raw
            transforms = api.portal.get_tool(name='portal_transforms')
            stream = transforms.convertTo('text/plain',
                                          html,
                                          mimetype='text/html')
            text = stream.getData().strip()
            body = meta + ' ' + text
        return body

    def reading_time(self, uid):
        text = self._readable_text(uid)
        text_count = len(text.split(' '))
        rt = text_count / 200
        return rt
