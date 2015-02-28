# -*- coding: UTF-8 -*-
""" Module listing available and asigned blog categories """

import datetime
import json
import time
import urllib2

from AccessControl import Unauthorized
from Acquisition import aq_inner
from Products.CMFCore.interfaces import IContentish
from Products.CMFPlone.utils import safe_unicode
from five import grok
from plone import api
from plone.app.contentlisting.interfaces import IContentListing
from plone.app.layout.navigation.interfaces import INavigationRoot
from plone.event.utils import pydt
from plone.i18n.normalizer.interfaces import IIDNormalizer
from zope.component import getMultiAdapter
from zope.component import getUtility

from meetshaus.blog.blogentry import IBlogEntry
from meetshaus.blog import MessageFactory as _


class BlogCategories(grok.View):
    grok.context(IContentish)
    grok.require('zope2.View')
    grok.name('blog-categories')

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


class BlogCategory(grok.View):
    grok.context(IContentish)
    grok.require('zope2.View')
    grok.name('category')

    @property
    def traverse_subpath(self):
        return self.subpath

    def publishTraverse(self, request, name):
        if not hasattr(self, 'subpath'):
            self.subpath = []
        self.subpath.append(name)
        return self

    def stored_data(self):
        records = api.portal.get_registry_record(
            'meetshaus.blog.interfaces.IBlogToolSettings.blog_categories')
        return json.loads(records)

    def selected_category(self):
        return self.traverse_subpath[0]

    def records(self):
        data = self.stored_data()
        return data['items']

    def record(self):
        category = self.selected_category()
        for x in self.records():
            if x['title'] == category:
                return x
        return None

    def blog_entries(self):
        catalog = api.portal.get_tool(name='portal_catalog')
        subject = self.selected_category()
        brains = catalog(object_provides=IBlogEntry.__identifier__,
                         Subject=subject.encode('utf-8'),
                         sort_on='effective',
                         sort_order='reverse')
        return IContentListing(brains)

    def timestamp(self, uid):
        item = api.content.get(UID=uid)
        date = item.effective()
        date = pydt(date)
        timestamp = {}
        timestamp['day'] = date.strftime("%d")
        timestamp['month'] = date.strftime("%B")
        timestamp['year'] = date.strftime("%Y")
        timestamp['date'] = date
        return timestamp

    def _readable_text(self, uid):
        context = api.content.get(UID=uid)
        meta = context.title + ' ' + context.description
        if context.text:
            html = context.text.raw
            transforms = api.portal.get_tool(name='portal_transforms')
            stream = transforms.convertTo('text/plain',
                                          html,
                                          mimetype='text/html')
            text = stream.getData().strip()
            body = meta + ' ' + text
        return body

    def reading_time(self, uid):
        text = self._readable_text(uid)
        text_count = len(text.split(' '))
        rt = text_count / 200
        return rt


class ManageBlogCategories(grok.View):
    grok.context(IContentish)
    grok.require('zope2.View')
    grok.name('manage-blog-categories')

    def stored_data(self):
        records = api.portal.get_registry_record(
            'meetshaus.blog.interfaces.IBlogToolSettings.blog_categories')
        return json.loads(records)

    def records(self):
        data = self.stored_data()
        return data['items']


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
                self._update_stored_categories(form)

    @property
    def traverse_subpath(self):
        return self.subpath

    def publishTraverse(self, request, name):
        if not hasattr(self, 'subpath'):
            self.subpath = []
        self.subpath.append(name)
        return self

    def stored_data(self):
        records = api.portal.get_registry_record(
            'meetshaus.blog.interfaces.IBlogToolSettings.blog_categories')
        return json.loads(records)

    def getFieldname(self):
        return self.traverse_subpath[0]

    def getFieldData(self):
        fieldname = self.getFieldname()
        data = self.stored_data()
        records = data['items']
        item = records[int(fieldname)]
        return item['description']

    def category(self):
        fieldname = self.getFieldname()
        data = self.stored_data()
        records = data['items']
        return records[int(fieldname)]

    def _update_stored_categories(self, data):
        context = aq_inner(self.context)
        start = time.time()
        idx = int(self.getFieldname())
        new_value = data['content-editable-form-body']
        stored = self.stored_data()
        records = stored['items']
        record = records[idx]
        record['description'] = safe_unicode(new_value)
        records[idx] = record
        stored['items'] = records
        # store in registry here
        end = time.time()
        stored.update(dict(
            _runtime=str(end-start),
            timestamp=str(int(time.time())),
            updated=str(datetime.datetime.now())
        ))
        api.portal.set_registry_record(
            'meetshaus.blog.interfaces.IBlogToolSettings.blog_categories',
            safe_unicode(json.dumps(stored)))
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
        catalog = api.portal.get_tool(name='portal_catalog')
        keywords = catalog.uniqueValuesFor('Subject')
        keywords = [unicode(k, 'utf-8') for k in keywords]
        return keywords

    def _normalize_keyword(self, keyword):
        normalizer = getUtility(IIDNormalizer)
        return normalizer.normalize(keyword)

    def _count_entries(self, keyword):
        catalog = api.portal.get_tool(name='portal_catalog')
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
