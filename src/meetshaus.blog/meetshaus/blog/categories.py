# -*- coding: UTF-8 -*-
""" Module listing available and asigned blog categories """
import urllib2
from plone import api
from five import grok
from Products.CMFCore.interfaces import IContentish

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
