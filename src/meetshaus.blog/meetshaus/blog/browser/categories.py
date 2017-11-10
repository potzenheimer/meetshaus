# -*- coding: utf-8 -*-
"""Module providing blog category views and management"""
import json
import urllib2

import time

import datetime

from Products.CMFPlone.utils import safe_unicode
from Products.Five import BrowserView
from meetshaus.blog.blogpost import IBlogPost
from plone import api
from plone.i18n.normalizer import IIDNormalizer
from zope.component import getUtility


class BlogCategoriesView(BrowserView):

    def __init__(self, context, request):
        self.context = context
        self.request = request

    def __call__(self, **kw):
        return self.render()

    def render(self):
        return self.index()

    def authenticated(self):
        return not api.user.is_anonymous()

    def catalog(self):
        return api.portal.get_tool(name='portal_catalog')

    def stored_data(self):
        records = api.portal.get_registry_record(
            'meetshaus.blog.interfaces.IBlogToolSettings.blog_categories')
        return json.loads(records)

    def records(self):
        data = self.stored_data()
        return data['items']

    def keywords(self):
        catalog = self.catalog()
        keywords = catalog.uniqueValuesFor('Subject')
        keywords = [unicode(k, 'utf-8') for k in keywords]
        return keywords

    def count_entries(self, subject):
        catalog = self.catalog()
        brains = catalog(object_provides=IBlogEntry.__identifier__,
                         Subject=subject.encode('utf-8'))
        return len(brains)

    def archive_url(self, subject):
        portal_url = api.portal.get().absolute_url()
        sub = urllib2.quote(subject.encode('utf-8'))
        url = '{0}/blog?category={1}'.format(portal_url, sub)
        return url


class BlogCategoriesManager(BrowserView):
    """ Central blog category management"""

    @staticmethod
    def stored_data():
        records = api.portal.get_registry_record(
            'meetshaus.blog.interfaces.IBlogToolSettings.blog_categories')
        return json.loads(records)

    def records(self):
        data = self.stored_data()
        return data['items']


class UpdateBlogCategoryStorage(BrowserView):
    """Update json storage with new database entries"""

    def __call__(self, *args, **kwargs):
        start = time.time()
        data = self._process_request()
        end = time.time()
        data.update(dict(_runtime=str(end-start)))
        api.portal.set_registry_record(
            'meetshaus.blog.interfaces.IBlogToolSettings.blog_categories',
            safe_unicode(json.dumps(data)))
        next_url = api.portal.get().absolute_url()
        return self.request.response.redirect(next_url)

    def keywords(self):
        catalog = api.portal.get_tool(name='portal_catalog')
        keywords = catalog.uniqueValuesFor('Subject')
        keywords = [unicode(k, 'utf-8') for k in keywords]
        return keywords

    def _normalize_keyword(self, keyword):
        normalizer = getUtility(IIDNormalizer)
        return normalizer.normalize(keyword)

    def _count_entries(self, keyword):
        catalog = api.portal.get_tool(name='portal_catalog')
        brains = catalog(object_provides=IBlogPost.__identifier__,
                         Subject=keyword.encode('utf-8'))
        return len(brains)

    def _build_archive_url(self, keyword):
        portal_url = api.portal.get().absolute_url()
        sub = urllib2.quote(keyword.encode('utf-8'))
        url = '{0}/blog?category={1}'.format(portal_url, sub)
        return url

    def _process_request(self):
        api_url = self.request.get('ACTUAL_URL')
        data = {
            'url': api_url,
            'timestamp': str(int(time.time())),
            'created': str(datetime.datetime.now()),
            'updated': str(datetime.datetime.now())
        }
        items = list()
        for kw in self.keywords():
            info = {
                'id': self._normalize_keyword(kw),
                'url': self._build_archive_url(kw),
                'count': str(self._count_entries(kw)),
                'title': kw,
                'description': ''
            }
            items.append(info)
        data['items'] = items
        return data
