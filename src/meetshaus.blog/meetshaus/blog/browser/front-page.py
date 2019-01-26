# -*- coding: utf-8 -*-
"""Module providing blog entry listings"""
import calendar

from Acquisition import aq_inner
from DateTime import DateTime
from Products.CMFCore.utils import getToolByName
from Products.Five import BrowserView
from plone import api
from plone.app.contentlisting.interfaces import IContentListing
from plone.batching import Batch

from meetshaus.blog.blogpost import IBlogPost
from meetshaus.blog.interfaces import IContentInfoProvider
from plone.memoize.view import memoize


class FrontPageView(BrowserView):
    """ Blog front page """

    def __init__(self, context, request):
        super(FrontPageView, self).__init__(context, request)
        self.context = context
        self.request = request

    def __call__(self, **kw):
        self.year = int(self.request.form.get("year", 0))
        self.month = int(self.request.form.get("month", 0))
        self.subject = self.request.form.get("category", None)
        self.b_start = self.request.form.get("b_start", 0)
        return self.render()

    def render(self):
        return self.index()

    @staticmethod
    def _base_query():
        portal = api.portal.get()
        blog = portal["blog"]
        obj_provides = IBlogPost.__identifier__
        path = "/".join(blog.getPhysicalPath())
        return dict(
            path={"query": path, "depth": 1},
            object_provides=obj_provides,
            sort_on="effective",
            sort_order="reverse",
        )

    def get_entries(self, year=None, month=None, subject=None):
        context = aq_inner(self.context)
        catalog = getToolByName(context, "portal_catalog")
        query = self._base_query()
        if subject:
            query["Subject"] = subject
        if year:
            if month:
                last_day = calendar.monthrange(year, month)[1]
                start_date = DateTime(year, month, 1, 0, 0)
                end_date = DateTime(year, month, last_day, 23, 59, 59)
            else:
                start_date = DateTime(year, 1, 1, 0, 0)
                end_date = DateTime(year, 12, 31, 0, 0)
            query["effective"] = dict(
                query=(start_date, end_date), range="minmax"
            )
        results = catalog.searchResults(**query)
        return IContentListing(results)

    def blog_posts(self):
        """List all blog items as brains"""
        posts = self.get_entries(
            year=self.year, month=self.month, subject=self.subject
        )
        return posts

    def batch(self):
        b_size = 10
        items = self.blog_posts()
        return Batch(items, b_size, self.b_start, orphan=1)

    def has_headline(self, uuid):
        context = api.content.get(UID=uuid)
        try:
            headline = context.headline
        except AttributeError:
            headline = None
        if headline is not None:
            return True
        return False

    def has_abstract(self, uuid):
        context = api.content.get(UID=uuid)
        try:
            abstract = context.abstract
        except AttributeError:
            abstract = None
        if abstract is not None:
            return True
        return False

    @memoize
    def content_info_provider(self, uuid):
        context = api.content.get(UID=uuid)
        return IContentInfoProvider(context)

    def time_stamp(self, uuid):
        return self.content_info_provider(uuid).time_stamp()

    def reading_time(self, uuid):
        return self.content_info_provider(uuid).reading_time()

    def post_content_snippet(self, uuid):
        return self.content_info_provider(uuid).content_snippet()
