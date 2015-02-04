# -*- coding: UTF-8 -*-
""" Module listing available and asigned blog categories """

import datetime
import json
import time
import urllib2

from AccessControl import Unauthorized
from Acquisition import aq_inner
from Products.CMFPlone.utils import safe_unicode
from Products.CMFCore.interfaces import IContentish
from five import grok
from plone import api
from plone.app.layout.navigation.interfaces import INavigationRoot
from zope.component import getUtility
from zope.component import getMultiAdapter
from plone.i18n.normalizer.interfaces import IIDNormalizer

from meetshaus.blog.blogentry import IBlogEntry
from meetshaus.blog import MessageFactory as _


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


class ManageBlogCategories(grok.View):
    grok.context(IContentish)
    grok.require('zope2.View')
    grok.name('manage-blog-categories')

    def stored_data(self):
        records = api.portal.set_registry_record(
            'meetshaus.blog.interfaces.IBlogToolSettings.blog_categories')
        return json.loads(records)


class UpdateBlogCategories(grok.View):
    grok.context(IContentish)
    grok.require('zope2.View')
    grok.name('update-blog-categories')

    def update(self):
        context = aq_inner(self.context)
        self.errors = {}
        unwanted = ('_authenticator', 'form.button.Submit')
        required = ('field-name')
        if 'form.button.Submit' in self.request:
            authenticator = getMultiAdapter((context, self.request),
                                            name=u"authenticator")
            if not authenticator.verify():
                raise Unauthorized
            form = self.request.form
            form_data = {}
            form_errors = {}
            errorIdx = 0
            for value in form:
                if value not in unwanted:
                    form_data[value] = safe_unicode(form[value])
                    if not form[value] and value in required:
                        error = {}
                        error['active'] = True
                        error['msg'] = _(u"This field is required")
                        form_errors[value] = error
                        errorIdx += 1
                    else:
                        error = {}
                        error['active'] = False
                        error['msg'] = form[value]
                        form_errors[value] = error
            if errorIdx > 0:
                self.errors = form_errors
            else:
                self._store_data(form)

    @property
    def traverse_subpath(self):
        return self.subpath

    def publishTraverse(self, request, name):
        if not hasattr(self, 'subpath'):
            self.subpath = []
        self.subpath.append(name)
        return self

    def stored_data(self):
        records = api.portal.set_registry_record(
            'meetshaus.blog.interfaces.IBlogToolSettings.blog_categories')
        return json.loads(records)

    def getFieldname(self):
        return self.traverse_subpath[1]

    def getFieldData(self):
        context = self.content_item()
        fieldname = self.getFieldname()
        data = self.stored_data()
        records = data['items']
        item = {}
        for record in records:
            if record['id'] == fieldname:
                item = record
        return item

    def _update_stored_categories(self, data):
        context = aq_inner(self.context)
        fieldname = self.getFieldname()
        new_value = data['content-editable-form-body']
        # store in registry here
        next_url = '{0}/@@manage-blog-categories'.format(
            context.absolute_url())
        api.portal.show_message(_(u"The item has successfully been updated"),
                                self.request,
                                type='info')
        return self.request.response.redirect(next_url)


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
            'created': str(datetime.datetime.now()),
            'updated': str(datetime.datetime.now()),
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
