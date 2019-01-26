# -*- coding: utf-8 -*-
"""Module providing reading time adapter"""
from Acquisition import aq_inner
from meetshaus.blog.utils import get_localized_month_name
from plone import api
from plone.dexterity.utils import safe_utf8
from plone.event.utils import pydt
from zope.interface import implements, implementer

from meetshaus.blog.interfaces import IContentInfoProvider


@implementer(IContentInfoProvider)
class ContentInfoProvider(object):

    def __init__(self, context):
        self.context = context

    def time_stamp(self):
        context = aq_inner(self.context)
        date = context.effective()
        date = pydt(date)
        timestamp = {
            "day": date.strftime("%d"),
            "month": get_localized_month_name(date.strftime("%B")),
            "year": date.strftime("%Y"),
            "date": date,
        }
        return timestamp

    @staticmethod
    def _readable_text(content_item):
        body = content_item.title + ' ' + content_item.description
        if content_item.text:
            html = content_item.text.raw
            transforms = api.portal.get_tool(name='portal_transforms')
            stream = transforms.convertTo('text/plain',
                                          html,
                                          mimetype='text/html')
            text = stream.getData().strip()
            body = safe_utf8(body) + ' ' + safe_utf8(text)
        return body

    def reading_time(self):
        context = aq_inner(self.context)
        text = self._readable_text(context)
        text_count = len(text.split(' '))
        rt = text_count / 200
        return rt

    def content_snippet(self, characters=320, content_ellipsis='[...]'):
        context = aq_inner(self.context)
        if context.text:
            text = context.text.raw
            portal_transforms = api.portal.get_tool(name="portal_transforms")
            # Output here is a single <p> which contains <br /> for newline
            stream = portal_transforms.convertTo(
                "text/plain", text, mimetype="text/html"
            )
            stream_data = stream.getData().strip()
            cropped_text = context.restrictedTraverse('@@plone').cropText(
                stream_data, characters, content_ellipsis
            )
            return cropped_text
