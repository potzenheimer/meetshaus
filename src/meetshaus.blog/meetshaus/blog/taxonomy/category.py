# -*- coding: utf-8 -*-
"""Module providing blog category management"""
import datetime
import json
import time
import urllib2

from plone import api
from Products.CMFPlone.utils import safe_unicode
from Products.Five import BrowserView
from zope.component import getUtility


from meetshaus.blog.blogpost import IBlogPost


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
        stored_records = api.portal.get_registry_record(
            'meetshaus.blog.interfaces.IBlogToolSettings.blog_categories'
        )
        if stored_records:
            data = json.loads(stored_records)
            data.update(dict(
                timestamp=str(int(time.time())),
                updated=str(datetime.datetime.now())
            ))
            records = stored_records
        else:
            data = {
                'url': api_url,
                'timestamp': str(int(time.time())),
                'created': str(datetime.datetime.now()),
                'updated': str(datetime.datetime.now())
            }
            records = list()

        for kw in self.keywords():
            info = {
                'id': self._normalize_keyword(kw),
                'url': self._build_archive_url(kw),
                'count': str(self._count_entries(kw)),
                'title': kw,
                'description': ''
            }
            records.append(info)
        data['items'] = records
        import pdb; pdb.set_trace()
        return data

    def render(self):
        start = time.time()
        data = self._process_request()
        end = time.time()
        data.update(dict(_runtime=str(end-start)))
        api.portal.set_registry_record(
            'meetshaus.blog.interfaces.IBlogToolSettings.blog_categories',
            safe_unicode(json.dumps(data)))
        next_url = api.portal.get().absolute_url()
        return self.request.response.redirect(next_url)
