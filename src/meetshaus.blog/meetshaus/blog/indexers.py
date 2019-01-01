# -*- coding: utf-8 -*-
"""Module providing a custom indexing setup for blog"""
from plone.dexterity.utils import safe_utf8
from plone.indexer.decorator import indexer

from meetshaus.blog.blogpost import IBlogPost


@indexer(IBlogPost)
def keyword_indexer(obj):
    if obj.subjects is None:
        return ()
    return tuple(safe_utf8(s) for s in obj.subjects)
