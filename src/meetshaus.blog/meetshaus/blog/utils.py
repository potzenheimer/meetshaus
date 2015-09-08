# -*- coding: utf-8 -*-
"""Module providing utility functions for the blogging tool"""

from Acquisition import aq_base
from Acquisition import aq_inner
from Acquisition import aq_parent
from Products.BTreeFolder2.BTreeFolder2 import BTreeFolder2Base
from plone.dexterity.interfaces import IDexterityFTI
from plone.portlets.interfaces import IPortletAssignmentMapping
from plone.portlets.interfaces import IPortletManager
from zope.component import ComponentLookupError
from zope.component import getMultiAdapter
from zope.component import getUtility
from zope.component import queryUtility

import importlib
import logging

logger = logging.getLogger(__name__)


def find_portlet_assignment_context(assignment, context):
    # Finds the creation context of the assignment
    context = aq_inner(context)
    manager_name = assignment.manager.__name__
    assignment_name = assignment.__name__
    while True:
        try:
            manager = getUtility(IPortletManager,
                                 manager_name,
                                 context=context)
            mapping = getMultiAdapter((context, manager),
                                      IPortletAssignmentMapping)
            if assignment_name in mapping:
                if mapping[assignment_name] is aq_base(assignment):
                    return context
        except ComponentLookupError:
            pass
        parent = aq_parent(context)
        if parent is context:
            return None
        context = parent


def get_old_class_name_string(obj):
    """Returns the current class name string."""
    return '{0}.{1}'.format(obj.__module__, obj.__class__.__name__)


def get_portal_type_name_string(obj):
    """Returns the klass-attribute of the fti."""
    fti = queryUtility(IDexterityFTI, name=obj.portal_type)
    if not fti:
        return False
    return fti.klass


def migrate_base_class_to_new_class(obj,
                                    indexes=[
                                        'is_folderish',
                                        'object_provides',
                                    ],
                                    old_class_name='',
                                    new_class_name='',
                                    migrate_to_folderish=False,
                                    ):
    if not old_class_name:
        old_class_name = get_old_class_name_string(obj)
    if not new_class_name:
        new_class_name = get_portal_type_name_string(obj)
        if not new_class_name:
            logger.warning(
                'The type {0} has no fti!'.format(obj.portal_type))
            return False

    was_item = not isinstance(obj, BTreeFolder2Base)
    if old_class_name != new_class_name:
        obj_id = obj.getId()
        module_name, class_name = new_class_name.rsplit('.', 1)
        module = importlib.import_module(module_name)
        new_class = getattr(module, class_name)

        # update obj class
        parent = obj.__parent__
        parent._delOb(obj_id)
        obj.__class__ = new_class
        parent._setOb(obj_id, obj)

    is_container = isinstance(obj, BTreeFolder2Base)

    if was_item and is_container or migrate_to_folderish and is_container:
        #  If Itemish becomes Folderish we have to update obj _tree
        BTreeFolder2Base._initBTrees(obj)

    # reindex
    obj.reindexObject(indexes)

    return True
