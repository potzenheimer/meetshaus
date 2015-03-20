# -*- coding: utf-8 -*-
"""Module providing base class migration for blog entry content"""
from five import grok
from plone import api
from Products.statusmessages.interfaces import IStatusMessage
from meetshaus.blog import utils
from meetshaus.blog.blogentry import IBlogEntry


class BaseClassCleanup(grok.View):
    grok.context(IBlogEntry)
    grok.require('cmf.ManagePortal')
    grok.name('cleanup-base-classes')

    def render(self):
        catalog = api.portal.gat_tool(name="portal_catalog")
        migrated = []
        not_migrated = []
        for brain in catalog():
            obj = brain.getObject()
            if utils.migrate_base_class_to_new_class(
                    obj, migrate_to_folderish=True):
                migrated.append(obj)
            else:
                not_migrated.append(obj)

        messages = IStatusMessage(self.request)
        info_message_template = 'There are {0} objects migrated.'
        warn_message_template = 'There are not {0} objects migrated.'
        if migrated:
            msg = info_message_template.format(len(migrated))
            messages.addStatusMessage(msg, type='info')
        if not_migrated:
            msg = warn_message_template.format(len(not_migrated))
            messages.addStatusMessage(msg, type='warn')
        self.request.response.redirect(self.request['ACTUAL_URL'])
