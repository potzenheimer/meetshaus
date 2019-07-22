# -*- coding: utf-8 -*-
"""Module providing blog entry views"""
import six
from AccessControl import Unauthorized
from Acquisition import aq_inner, aq_parent
from Products.CMFCore.utils import getToolByName
from Products.CMFPlone.utils import safe_unicode
from Products.Five import BrowserView
from meetshaus.blog.interfaces import IContentInfoProvider
from meetshaus.blog.utils import get_localized_month_name
from plone import api
from plone.app.textfield import IRichText, IRichTextValue
from plone.dexterity.utils import safe_utf8
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

    def has_headline(self):
        context = aq_inner(self.context)
        try:
            headline = context.headline
        except AttributeError:
            headline = None
        if headline is not None:
            return True
        return False

    def has_abstract(self):
        context = aq_inner(self.context)
        try:
            abstract = context.abstract
        except AttributeError:
            abstract = None
        if abstract is not None:
            return True
        return False

    def has_lead_image(self):
        context = aq_inner(self.context)
        try:
            lead_image = context.image
        except AttributeError:
            lead_image = None
        if lead_image is not None:
            return True
        return False

    @property
    def display_cover_image(self):
        context = aq_inner(self.context)
        if self.has_lead_image() and context.image_display:
            return True
        return False

    def parent_info(self):
        context = aq_inner(self.context)
        parent = aq_parent(context)
        try:
            if (
                getattr(parent, "getId", None) is None
                or parent.getId() == "talkback"
            ):
                parent = aq_parent(aq_inner(parent))
            return parent
        except Unauthorized:
            return None

    def time_stamp(self):
        context = aq_inner(self.context)
        content_info_provider = IContentInfoProvider(context)
        return content_info_provider.time_stamp()

    def reading_time(self):
        context = aq_inner(self.context)
        reading_time_provider = IContentInfoProvider(context)
        return reading_time_provider.reading_time()

    def entry_body_text(self):
        context = aq_inner(self.context)
        text = u''
        rich_text = getattr(context, 'text', None)
        if rich_text:
            if IRichTextValue.providedBy(rich_text):
                transforms = getToolByName(self, 'portal_transforms')
                # Before you think about switching raw/output
                # or mimeType/outputMimeType, first read
                # https://github.com/plone/Products.CMFPlone/issues/2066
                #raw = safe_unicode(rich_text.raw)
                #if six.PY2:
                #    raw = raw.encode('utf-8', 'replace')
                text = transforms.convertTo(
                    'text/html',
                    rich_text.raw_encoded
                ).getData().strip()
        return safe_unicode(text)


class BlogEntryExcerpt(BrowserView):
    """ A short excerpt of the main body text"""

    def transformed_body_text(self, characters=320, ellipsis='[...]'):
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
                stream_data, characters, ellipsis
            )
            return cropped_text


class BlogEntryContent(BrowserView):
    """ Blog entry  default view """

    def __init__(self, context, request):
        self.context = context
        self.request = request

    def __call__(self):
        return self.render()

    def render(self):
        return self.index()

    def has_headline(self):
        context = aq_inner(self.context)
        try:
            headline = context.headline
        except AttributeError:
            headline = None
        if headline is not None:
            return True
        return False

    def has_abstract(self):
        context = aq_inner(self.context)
        try:
            abstract = context.abstract
        except AttributeError:
            abstract = None
        if abstract is not None:
            return True
        return False

    def parent_info(self):
        context = aq_inner(self.context)
        parent = aq_parent(context)
        try:
            if (
                getattr(parent, "getId", None) is None
                or parent.getId() == "talkback"
            ):
                parent = aq_parent(aq_inner(parent))
            return parent
        except Unauthorized:
            return None

    def timestamp(self):
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

    def _readable_text(self):
        context = aq_inner(self.context)
        meta = context.title + " " + context.description
        if context.text:
            html = context.text.raw
            transforms = api.portal.get_tool(name="portal_transforms")
            stream = transforms.convertTo(
                "text/plain", html, mimetype="text/html"
            )
            text = stream.getData().strip()
            body = meta + " " + text
        return body

    def reading_time(self):
        text = self._readable_text()
        text_count = len(text.split(" "))
        rt = text_count / 200
        return rt
