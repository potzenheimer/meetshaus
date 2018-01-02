# -*- coding: utf-8 -*-
"""Module providing blog category management"""
import json

from Acquisition import aq_inner
from Products.Five import BrowserView
from meetshaus.blog.interfaces import ITaxonomyTool
from plone import api
from zope.component import getUtility


class CategoryView(BrowserView):
    """ Category list """

    def __init__(self, context, request):
        self.context = context
        self.request = request

    def __call__(self):
        return self.render()

    def render(self):
        return self.index()


class UpdateCategoryStorage(BrowserView):
    """ Category list """

    def __init__(self, context, request):
        self.context = context
        self.request = request

    def __call__(self):
        return self.render()

    def render(self):
        return self.index()

    def stored_data(self):
        context = aq_inner(self.context)
        context_uid = api.content.get_uuid(obj=context)
        tool = getUtility(ITaxonomyTool)
        data = tool.read(context_uid)
        return data

    def records(self):
        data = self.stored_data()
        return data['items']

    def has_records(self):
        if self.records():
            return True
        return False
