# -*- coding: utf-8 -*-
"""Module providing base class migration for blog entry content"""
import lxml
from Acquisition import aq_inner
from Products.Five.browser import BrowserView
from plone import api
from zope.component import getMultiAdapter
from zope.lifecycleevent import modified

from meetshaus.blog.blogentry import IBlogEntry


class BlogMigrationView(BrowserView):
    """ Migrate blog content

    Move blog entries to folderish blog posting content types and
    transfer the associated images to the folder content
    """

    def __call__(self):
        self.has_blogentries = len(self.blogentries()) > 0
        return self.render()

    def render(self):
        return self.index()

    def blogentries(self):
        items = api.content.find(
            context=api.portal.get(),
            object_provides=IBlogEntry,
            sort_on='effective',
            sort_order='reverse'
        )
        return items


class BlogMigrationRunnerView(BrowserView):
    """ Blog migration runner """

    def __call__(self):
        return self.render()

    def render(self):
        context = aq_inner(self.context)
        base_url = context.absolute_url()
        authenticator = getMultiAdapter((context, self.request),
                                        name=u"authenticator")
        next_url = '{0}/@@migration-finished?_authenticator={1}'.format(
            base_url, authenticator.token())
        self._migrate_blog_posts(context)
        modified(context)
        context.reindexObject(idxs='modified')
        return self.request.response.redirect(next_url)

    def _migrate_blog_posts(self):
        context = aq_inner(self.context)
        migrated = []
        not_migrated = []
        import pdb; pdb.set_trace()
        results = api.content.find(
            context=api.portal.get(),
            object_provides=IBlogEntry
        )
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
            migrated.append(obj.UID())
        info_message_template = 'There are {0} objects migrated.'
        warn_message_template = 'There are {0} objects not migrated.'
        if migrated:
            msg = info_message_template.format(len(migrated))
        if not_migrated:
            msg = warn_message_template.format(len(not_migrated))
        api.portal.show_message(
            message=msg,
            request=self.request
        )
        return len(migrated)
