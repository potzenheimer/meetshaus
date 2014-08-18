# -*- coding: UTF-8 -*-
""" Module providing folderish blog content type """
import calendar
from Acquisition import aq_inner
from DateTime import DateTime
from Products.CMFCore.utils import getToolByName
from Products.CMFPlone.PloneBatch import Batch
from five import grok
from plone import api
from plone.app.contentlisting.interfaces import IContentListing
from plone.app.discussion.interfaces import IConversation
from plone.app.z3cform.wysiwyg import WysiwygFieldWidget
from plone.directives import form
from plone.event.utils import pydt
from zope import schema

from meetshaus.blog.blogentry import IBlogEntry

from meetshaus.blog import MessageFactory as _


class IBlog(form.Schema):
    """
    Blog Content folder.
    """
    form.widget(bio=WysiwygFieldWidget)
    bio = schema.Text(
        title=_(u'About the Author'),
        description=_(u'A short bio about the author of the blog.'),
        required=False,
    )


class BlogView(grok.View):
    grok.context(IBlog)
    grok.require('zope2.View')
    grok.name('blog-view')

    def blogitems(self):
        """List all blog items as brains"""
        year = int(self.request.form.get('year', 0))
        month = int(self.request.form.get('month', 0))
        subject = self.request.form.get('category', None)
        return self.get_entries(year=year, month=month, subject=subject)

    def batch(self):
        b_size = 10
        b_start = self.request.form.get('b_start', 0)
        return Batch(self.blogitems(), b_size, b_start, orphan=1)

    def commentsEnabled(self, ob):
        conversation = IConversation(ob)
        return conversation.enabled()

    def commentCount(self, ob):
        conversation = IConversation(ob)
        return len(conversation)

    def _base_query(self):
        context = aq_inner(self.context)
        obj_provides = IBlogEntry.__identifier__
        path = '/'.join(context.getPhysicalPath())
        return dict(path={'query': path, 'depth': 1},
                    object_provides=obj_provides,
                    sort_on='effective', sort_order='reverse')

    def get_entries(self, year=None, month=None, subject=None):
        context = aq_inner(self.context)
        catalog = getToolByName(context, 'portal_catalog')
        query = self._base_query()
        if subject:
            query['Subject'] = subject
        if year:
            if month:
                lastday = calendar.monthrange(year, month)[1]
                startdate = DateTime(year, month, 1, 0, 0)
                enddate = DateTime(year, month, lastday, 23, 59, 59)
            else:
                startdate = DateTime(year, 1, 1, 0, 0)
                enddate = DateTime(year, 12, 31, 0, 0)
            query['effective'] = dict(query=(startdate, enddate),
                                      range='minmax')
        results = catalog.searchResults(**query)
        return IContentListing(results)

    def timestamp(self, uid):
        item = api.content.get(UID=uid)
        date = item.effective()
        date = pydt(date)
        timestamp = {}
        timestamp['day'] = date.strftime("%d")
        timestamp['month'] = date.strftime("%B")
        timestamp['year'] = date.strftime("%Y")
        timestamp['date'] = date
        return timestamp

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
