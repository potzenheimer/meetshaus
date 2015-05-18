# -*- coding: UTF-8 -*-
""" Module providing blog entry dexterity content type """

from five import grok
from plone import api
from plone.app.layout.viewlets.interfaces import IBelowContentBody
from AccessControl import Unauthorized
from Acquisition import aq_inner, aq_parent
from plone.directives import form
from plone.event.utils import pydt

from plone.app.textfield import RichText

from plone.namedfile.interfaces import IImageScaleTraversable

from meetshaus.blog import MessageFactory as _


# Interface class; used to define content-type schema.

class IBlogPost(form.Schema, IImageScaleTraversable):
    """
    A single blog entry for the rgd blog
    """
    text = RichText(
        title=_(u"Blog Entry"),
        description=_(u""),
        required=True,
    )


class BlogPostView(grok.View):
    grok.context(IBlogPost)
    grok.require('zope2.View')
    grok.name('view')

    def parent_info(self):
        context = aq_inner(self.context)
        parent = aq_parent(context)
        try:
            if (getattr(parent, 'getId', None) is None or
                    parent.getId() == 'talkback'):
                # Skip any Z3 views that may be in the acq tree;
                # Skip past the talkback container if that's where we are
                parent = aq_parent(aq_inner(parent))
            return parent
        except Unauthorized:
            return None

    def timestamp(self):
        context = aq_inner(self.context)
        date = context.effective()
        date = pydt(date)
        timestamp = {}
        timestamp['day'] = date.strftime("%d")
        timestamp['month'] = date.strftime("%B")
        timestamp['year'] = date.strftime("%Y")
        timestamp['date'] = date
        return timestamp

    def _readable_text(self):
        context = aq_inner(self.context)
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


class BlogPostViewlet(grok.Viewlet):
    grok.context(IBlogPost)
    grok.viewletmanager(IBelowContentBody)
    grok.require('zope2.View')
    grok.name('meetshaus.blog.BlogEntryViewlet')

    def timestamp(self):
        context = aq_inner(self.context)
        date = context.effective()
        date = pydt(date)
        timestamp = {}
        timestamp['day'] = date.strftime("%d")
        timestamp['month'] = date.strftime("%B")
        timestamp['year'] = date.strftime("%Y")
        timestamp['date'] = date
        return timestamp

    def _readable_text(self):
        context = aq_inner(self.context)
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
