# -*- coding: UTF-8 -*-
"""Lecture edit form schema interfaces"""

from plone.directives import form
from plone.namedfile.field import NamedBlobFile
from plone.theme.interfaces import IDefaultPloneLayer
from z3c.form.browser.checkbox import CheckBoxFieldWidget
from zope import schema
from zope.interface import Interface

from hph.lectures import MessageFactory as _


class ITaxonomyTool(Interface):
    """ Course module data processing

        General tool providing CRUD operations for assigning modules
        to lecture content objects
    """

    def create(context):
        """ Create asset assignment data file

        The caller is responsible for passing a valid data dictionary
        containing the necessary details

        Returns JSON object

        @param uuid:        content object UID
        @param data:        predefined initial data dictionary
        """

    def read(context):
        """ Read stored data from object

        Returns a dictionary

        @param uuid:        object UID
        @param key:         (optional) dictionary item key
        """

    def update(context):
        """ Update stored data from object

        Returns a dictionary

        @param uuid:        object UID
        @param key:         (optional) dictionary item key
        @param data:        data dictionary
        """

    def delete(context):
        """ Delete stored data from object

        Returns a dictionary

        @param uuid:        caravan site object UID
        @param key:         (optional) dictionary item key
        """


class ICategoryManagementTool(Interface):
    """ Course filter tool

        General tool providing module filter session storage
    """
    def create(context):
        """ Create session storage instance

        The caller is responsible for passing a valid data dictionary
        containing the necessary details

        Returns JSON object

        @param data:        predefined initial data dictionary
        """

    def delete(context):
        """ Destroy session storage instance

        Returns JSON object

        @param session_id:        session UID
        """


class ICourseFilterUpdater(Interface):
    """ Course filter session updater

        General tool providing CRUD operations for storing module filters
        as json data
    """
