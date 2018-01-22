# -*- coding: utf-8 -*-
"""Module providing blog category management"""
import datetime
import json
import time
import urllib2

from AccessControl import Unauthorized
from Acquisition import aq_inner
from Products.CMFPlone.utils import safe_unicode
from Products.Five import BrowserView
from plone import api
from plone.i18n.normalizer.interfaces import IIDNormalizer
from plone.protect.interfaces import IDisableCSRFProtection
from zope.component import getMultiAdapter
from zope.component import getUtility
from zope.interface import alsoProvides

from meetshaus.blog.blogpost import IBlogPost
from meetshaus.blog.taxonomy.interfaces import ITaxonomyTool



class CategoryView(BrowserView):
    """ Category list """

    def __init__(self, context, request):
        self.context = context
        self.request = request

    def __call__(self):
        return self.render()

    def render(self):
        return self.index()


class TaxonomyTermSelection(BrowserView):
    """ Select stored keywords to use in frontend and
        taxonomy manager
    """
    def __init__(self, context, request):
        self.context = context
        self.request = request
        alsoProvides(self.request, IDisableCSRFProtection)

    def __call__(self):
        return self.render()

    def update(self):
        unwanted = ('_authenticator', 'form.button.Submit')
        required = ('email', 'subject')
        if 'form.button.Submit' in self.request:
            authenticator = getMultiAdapter((self.context, self.request),
                                            name=u"authenticator")
            if not authenticator.verify():
                raise Unauthorized
            form = self.request.form
            self.update_taxonomy(form)

    def render(self):
        self.update()
        return self.index()

    def stored_data(self):
        records = api.portal.get_registry_record(
            'meetshaus.blog.interfaces.IBlogToolSettings.blog_categories')
        return json.loads(records)

    def records(self):
        data = self.stored_data()
        return data['items']

    def has_selectable_terms(self):
        return len(self.records()) > 0

    def update_taxonomy(self, form_data):
        start = time.time()
        context = aq_inner(self.context)
        records = self.records()
        for record in records:
            record_id = record['id']
            if record_id in form_data.keys():
                record['enabled'] = True
            else:
                record['enabled'] = False
        data = self.stored_data()
        data['items'] = records
        end = time.time()
        data.update(
            dict(_runtime=str(end-start),
                 updated=str(datetime.datetime.now())
            )
        )
        api.portal.set_registry_record(
            'meetshaus.blog.interfaces.IBlogToolSettings.blog_categories',
            safe_unicode(json.dumps(data)))
        next_url = '{0}/@@manage-taxonomy-terms'.format(
            context.absolute_url()
        )
        return self.request.response.redirect(next_url)


class TaxonomyTermManager(BrowserView):
    """ Category Management """

    def stored_data(self):
        records = api.portal.get_registry_record(
            'meetshaus.blog.interfaces.IBlogToolSettings.blog_categories')
        return json.loads(records)

    def records(self):
        data = self.stored_data()
        return data['items']


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
        updated_records = list()
        stored_records = api.portal.get_registry_record(
            'meetshaus.blog.interfaces.IBlogToolSettings.blog_categories'
        )
        if stored_records:
            data = json.loads(stored_records)
            data.update(dict(
                timestamp=str(int(time.time())),
                updated=str(datetime.datetime.now())
            ))
            records = data['items']
        else:
            data = {
                'url': api_url,
                'timestamp': str(int(time.time())),
                'created': str(datetime.datetime.now()),
                'updated': str(datetime.datetime.now())
            }
            records = list()

        record_ids = [record['id'] for record in records]


        for kw in self.keywords():
            term_id = self._normalize_keyword(kw)
            if term_id in record_ids:
                # Update existing record
                existing_record = next((item for item in records
                    if item["id"] == term_id))
                if 'enabled' not in existing_record:
                    existing_record['enabled'] = True
            else:
                info = {
                    'id': term_id,
                    'url': self._build_archive_url(kw),
                    'count': str(self._count_entries(kw)),
                    'title': kw,
                    'description': '',
                    'enabled': True
                }
                records.append(info)
        data['items'] = records
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
