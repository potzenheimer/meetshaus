# -*- coding: utf-8 -*-
"""Module providing a json data storage api for categories"""
from builtins import str
from builtins import object
import datetime
import json
import time
import uuid as uuid_tool
from Products.CMFPlone.utils import safe_unicode
from collective.beaker.interfaces import ISession
from plone import api
from plone.memoize.view import memoize
from zope.globalrequest import getRequest
from zope.lifecycleevent import modified


class TaxonomyTool(object):
    """ Factory providing CRUD operations for blog category management """

    def create(self, uuid, data=None):
        item = api.content.get(UID=uuid)
        start = time.time()
        initial_data = self._create_record(uuid, item, data)
        end = time.time()
        initial_data.update(dict(_runtime=str(end-start)))
        json_data = json.dumps(initial_data)
        api.portal.set_registry_record(
            'meetshaus.blog.interfaces.IBlogToolSettings.blog_categories',
            self.safe_unicode(json_data))
        return json_data

    # @memoize
    def read(self, uuid, key=None):
        records = api.portal.get_registry_record(
            'meetshaus.blog.interfaces.IBlogToolSettings.blog_categories')
        return json.loads(records)

    def update(self, uuid, data, key=None):
        stored = self.read(uuid)
        start = time.time()
        if key is not None:
            records = stored['items']
            records[key] = data
        else:
            records = data
        end = time.time()
        stored['items'] = records
        stored.update(dict(_runtime=str(end-start),
                           timestamp=str(int(time.time())),
                           updated=str(datetime.datetime.now())))
        updated = json.dumps(stored)
        api.portal.set_registry_record(
            'meetshaus.blog.interfaces.IBlogToolSettings.blog_categories',
            self.safe_unicode(updated))
        return uuid

    def delete(self, uuid, key=None):
        stored = self.read(uuid)
        if key is not None:
            stored[key] = dict()
            updated = json.dumps(stored)
            item = api.content.get(UID=uuid)
            setattr(item, 'moduleInformation', updated)
            modified(item)
            item.reindexObject(idxs='modified')
        return uuid

    def get_record(self, uuid):
        data = dict()
        stored_data = self.read(uuid)
        if stored_data:
            for item in stored_data['items']:
                if 'degree-course' in item:
                    course_identifier = item['degree-course']
                    try:
                        course_module = item['module']
                    except KeyError:
                        course_module = None
                    course_theme = None
                    if 'course-theme' in item:
                        course_theme = item['course-theme']
                    if course_identifier in data:
                        course_data = data[course_identifier]
                    else:
                        # Add empty dictionary if course identifier
                        # does not yet exist
                        course_data = {}
                    if course_module:
                        if course_module in course_data:
                            module_info = course_data[course_module]
                        else:
                            module_info = list()
                        if course_theme:
                            module_info.append(course_theme)
                        course_data[course_module] = module_info
                    data[course_identifier] = course_data
        return data

    def get_record_index(self, uuid):
        stored_data = self.get_record(uuid)
        storage_blacklist = ('degree', 'info', 'theme')
        data = list()
        for course_key, course_value in list(stored_data.items()):
            course_title = self.get_degree_course_title(course_key)
            course_name = str(course_title)
            if course_value:
                module_titles = list()
                for module_name, module_theme in list(course_value.items()):
                    module_name_rendered = self.get_learning_modules(
                        course_key,
                        module_name
                    )
                    module_title = module_name_rendered
                    module_titles.append(module_title)
                    if module_theme:
                        for theme in module_theme:
                            module_title_and_theme = '{0} ({1})'.format(
                                module_title,
                                theme
                            )
                            module_titles.append(module_title_and_theme)
                if module_titles:
                    for title in module_titles:
                        course_name_item = '{0}: {1}'.format(
                            course_name,
                            str(title.encode('utf-8'))
                        )
                        data.append(course_name_item)
            data.append(course_name)
        module_data = list(set(sorted(data)))
        return module_data

    def _create_record(self, uuid, item, data):
        records = {
            "id": str(uuid_tool.uuid4()),
            "uid": str(uuid),
            "timestamp": str(int(time.time())),
            "_runtime": "0.0000059604644775390625",
            "created": datetime.datetime.now().isoformat(),
            "title": item.Title(),
            "items": []
        }
        # Add potential initial data
        if data:
            records['items'].append(data)
        return records

    def safe_encode(self, value):
        """Return safe unicode version of value.
        """
        su = safe_unicode(value)
        return su.encode('utf-8')


class CategoryManagementTool(object):
    """ Category management session storage tool

        Store selected filter configuration inside anonymous session
        to provide dynamically constructed filter forms
    """

    @staticmethod
    def get(key=None):
        """ Create module filter session """
        portal = api.portal.get()
        session_id = 'meetshaus.blog.category.{0}'.format(
            '.'.join(portal.getPhysicalPath())
        )
        if key:
            session_id = 'meetshaus.blog.category.{0}'.format(key)
        session = ISession(getRequest())
        if session_id not in session:
            session[session_id] = dict()
            session.save()
        return session[session_id]

    @staticmethod
    def destroy(key=None):
        """ Destroy module filter session """
        portal = api.portal.get()
        session_id = 'meetshaus.blog.category.{0}'.format(
            '.'.join(portal.getPhysicalPath())
        )
        if key:
            session_id = 'meetshaus.blog.category.{0}'.format(key)
        session = ISession(getRequest())
        if session_id in session:
            del session[session_id]
            session.save()

    def add(self, key, data=None):
        """
            Add item to survey session
        """
        records = self.get()
        record = self.update(key, data)
        if not record:
            records[key] = data
            return records[key]

    def update(self, key, data):
        records = self.get()
        record_id = key
        if record_id in records:
            records[record_id] = data
            return records[record_id]
        return None

    def remove(self, key):
        records = self.get()
        if key in records:
            del records[key]
            return key

    @staticmethod
    def create_record(token, data):
        records = {
            "id": str(uuid_tool.uuid4()),
            "timestamp": str(int(time.time())),
            "_runtime": "0.00000000000000000001",
            "created": datetime.datetime.now().isoformat(),
            "token": token,
            "filter": dict()
        }
        # Add potential initial data
        if data:
            records['filter'] = data
        return records


class CourseFilterUpdater(object):
    """ Factory providing CRUD operations for course module filters """
    @staticmethod
    def _create_record(data):
        records = {
            "id": str(uuid_tool.uuid4()),
            "timestamp": str(int(time.time())),
            "_runtime": "0.00000000000000000001",
            "created": datetime.datetime.now().isoformat(),
            "filter": dict()
        }
        # Add potential initial data
        if data:
            records['filter'].append(data)
        return records
