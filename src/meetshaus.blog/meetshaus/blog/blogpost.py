# -*- coding: UTF-8 -*-
""" Module providing blog entry dexterity content type """

from AccessControl import Unauthorized
from Acquisition import aq_inner, aq_parent
from five import grok
from plone import api
from plone.app.layout.viewlets.interfaces import IBelowContentBody
from plone.autoform import directives
from plone.dexterity.content import Container
from plone.directives import form
from plone.event.utils import pydt
from plone.namedfile.interfaces import IImageScaleTraversable
from zope import schema
from zope.interface import implementer

from meetshaus.blog.utils import get_localized_month_name

from meetshaus.blog import MessageFactory as _


# Interface class; used to define content-type schema.
class IBlogPost(form.Schema, IImageScaleTraversable):
    """
    A single folderish blog post
    """
    # default meta data overrides
    headline = schema.TextLine(
        title=_(u'label_headline', default=u'Headline'),
        description=_(
            u'help_headline',
            default=u'Used in listings and views as main headline instead of '
                    u'the default meta data title.'
        ),
        required=True
    )

    abstract = schema.Text(
        title=_(u'label_abstract', default=u'Abstract'),
        description=_(
            u'help_abstract',
            default=u'Used in listings and views instead of the default meta '
                    u'data description.'
        ),
        required=False,
        missing_value=u'',
    )

    form.order_before(not_last='summary')
    directives.order_after(headline='title')
    directives.order_after(abstract='description')


@implementer(IBlogPost)
class BlogPost(Container):
    pass


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
        timestamp['month'] = get_localized_month_name(date.strftime("%B"))
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
