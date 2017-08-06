# -*- coding: utf-8 -*-
"""Module providing blog entry views"""
from Products.Five import BrowserView


class BlogEntryView(BrowserView):
    """ Blog entry  default view """

    def __init__(self, context, request):
        self.context = context
        self.request = request

    def __call__(self):
        return self.render()

    def render(self):
        return self.index()
