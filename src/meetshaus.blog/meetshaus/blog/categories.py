# -*- coding: UTF-8 -*-
""" Module listing available and asigned blog categories """
import json
import time
import urllib2

from Products.CMFCore.interfaces import IContentish
from five import grok
from plone import api
from plone.app.layout.navigation.interfaces import INavigationRoot
from zope.component import getUtility
from plone.i18n.normalizer.interfaces import IIDNormalizer

from meetshaus.blog.blogentry import IBlogEntry


class BlogCategories(grok.View):
    grok.context(IContentish)
    grok.require('zope2.View')
    grok.name('blog-categories')

    def catalog(self):
        return api.portal.get_tool(name='portal_catalog')

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


class SetupBlogCategoryStorage(grok.View):
    grok.context(INavigationRoot)
    grok.require('cmf.ManagePortal')
    grok.name('setup-blog-category-storage')

    def keywords(self):
        catalog = self.catalog()
        keywords = catalog.uniqueValuesFor('Subject')
        keywords = [unicode(k, 'utf-8') for k in keywords]
        return keywords

    def _normalize_keyword(self, keyword):
        normalizer = getUtility(IIDNormalizer)
        return normalizer.normalize(keyword)

    def _count_entries(self, keyword):
        catalog = self.catalog()
        brains = catalog(object_provides=IBlogEntry.__identifier__,
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
        }
        items = list()
        for kw in self.keywords():
            info = {
                'id': self._normalize_keyword(kw),
                'url': self._build_archive_url(kw),
                'count': self._count_entries(kw),
                'title': kw,
                'description': ''
            }
            items.append(info)
        data['items'] = items
        return data

    def render(self):
        start = time.time()
        data = self._process_request()
        end = time.time()
        data.update(dict(_runtime=end-start))
        json_data = json.dumps(data)
        api.portal.set_registry_record(
            'meetshaus.blog.interfaces.IBlogToolSettings.blog_categories',
            json_data)
        next_url = api.portal.get().absolute_url()
        return self.request.response.redirect(next_url)
