# -*- coding: utf-8 -*-
"""Module providing base class migration for blog entry content"""
import lxml
from Acquisition import aq_inner
from five import grok
from plone import api
from Products.CMFCore.interfaces import IContentish
from Products.statusmessages.interfaces import IStatusMessage

from meetshaus.blog.blogentry import IBlogEntry


class MigrateBlogEntries(grok.View):
    grok.context(IContentish)
    grok.require('cmf.ManagePortal')
    grok.name('migrate-blog-enties')

    def render(self):
        context = aq_inner(self.context)
        migrated = []
        not_migrated = []
        results = api.content.find(object_provides=IBlogEntry)
        for brain in results:
            obj = brain.getObject()
            html_body = obj.text.raw
            xhtml = lxml.html.document_fromstring(html_body)
            images = xhtml.xpath('//img')
            if images:
                img_list = list()
                for i in images:
                    img_src = i.attrib['src']
                    if img_src.startswith('resolve'):
                        uuid = img_src.split('/')[1]
                        img_list.append(uuid)
            new_item = api.content.create(
                type='meetshaus.blog.blogpost',
                title=obj.Title(),
                container=context
            )
            setattr(new_item, 'Subject', obj.Subject())
            setattr(new_item, 'text', obj.text.raw)
            for img_uid in img_list:
                img_obj = api.content.get(UID=img_uid)
                api.content.move(source=img_obj, target=new_item)

        messages = IStatusMessage(self.request)
        info_message_template = 'There are {0} objects migrated.'
        warn_message_template = 'There are {0} objects not migrated.'
        if migrated:
            msg = info_message_template.format(len(migrated))
            messages.addStatusMessage(msg, type='info')
        if not_migrated:
            msg = warn_message_template.format(len(not_migrated))
            messages.addStatusMessage(msg, type='warn')
        self.request.response.redirect(self.request['ACTUAL_URL'])
