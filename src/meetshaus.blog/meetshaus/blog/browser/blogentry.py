# -*- coding: utf-8 -*-
"""Module providing blog entry views"""
from AccessControl import Unauthorized
from Acquisition import aq_inner, aq_parent
from Products.Five import BrowserView
from meetshaus.blog.utils import get_localized_month_name
from plone import api
from plone.event.utils import pydt


class BlogEntryView(BrowserView):
    """ Blog entry  default view """

    def __init__(self, context, request):
        self.context = context
        self.request = request

    def __call__(self):
        return self.render()

    def render(self):
        return self.index()

    def parent_info(self):
        context = aq_inner(self.context)
        parent = aq_parent(context)
        try:
            if (getattr(parent, 'getId', None) is None
                    or parent.getId() == 'talkback'):
                parent = aq_parent(aq_inner(parent))
            return parent
        except Unauthorized:
            return None

    def timestamp(self):
        context = aq_inner(self.context)
        date = context.effective()
        date = pydt(date)
        timestamp = {
            'day': date.strftime("%d"),
            'month': get_localized_month_name(date.strftime("%B")),
            'year': date.strftime("%Y"),
            'date': date
        }
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

