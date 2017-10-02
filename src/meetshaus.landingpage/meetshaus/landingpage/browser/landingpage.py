# -*- coding: UTF-8 -*-
""" Module providing landing pages """

from Acquisition import aq_inner
from five import grok
from plone import api

from plone.app.contentlisting.interfaces import IContentListing
from plone.event.utils import pydt

from meetshaus.blog.utils import get_localized_month_name

from meetshaus.blog.blogentry import IBlogEntry
from meetshaus.blog.blogpost import IBlogPost
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
        items = catalog(object_provides=IBlogPost.__identifier__,
                        review_state='published',
                        sort_on='effective',
                        sort_order='reverse',
                        limit=3)[:3]
        results = IContentListing(items)
        return results

    def latest_blogentry(self):
        return self.blogentries()[0]


    def blog_entry_preview(self):
        blogentry = self.latest_blogentry().getObject()
        template = blogentry.restrictedTraverse('@@blog-entry-content')()
        return template


    def timestamp(self):
        item = self.latest_blogentry()
        date = item.getObject().effective()
        date = pydt(date)
        timestamp = {
            'day': date.strftime("%d"),
            'month': get_localized_month_name(date.strftime("%B")),
            'year': date.strftime("%Y"),
            'date': date
        }
        return timestamp

    def _readable_text(self, uid):
        context = self.latest_blogentry()
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

    def reading_time(self):
        text = self._readable_text()
        text_count = len(text.split(' '))
        rt = text_count / 200
        return rt
