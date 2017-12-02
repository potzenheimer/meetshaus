# -*- coding: utf-8 -*-
"""Module providing blog category management"""
from Products.Five import BrowserView


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
