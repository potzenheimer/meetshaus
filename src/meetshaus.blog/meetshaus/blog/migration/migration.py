# -*- coding: utf-8 -*-
"""Module providing base class migration for blog entry content"""
import lxml
from Acquisition import aq_inner
from Products.Five import BrowserView
from meetshaus.blog import upgrades
from plone import api
from Products.CMFCore.interfaces import IContentish
from Products.statusmessages.interfaces import IStatusMessage

from meetshaus.blog.blogentry import IBlogEntry
from plone.protect.interfaces import IDisableCSRFProtection
from plone.protect.utils import addTokenToUrl
from zope.component import getMultiAdapter

from meetshaus.blog import MessageFactory as _
from zope.interface import alsoProvides


class AvailableTools(BrowserView):
    """ Migrate panel page content

    Query the catalog for legacy content impending removal
    """

    def __call__(self):
        return self.render()

    def render(self):
        return self.index()

    def protect_action_url(self, action_url):
        context = aq_inner(self.context)
        action_url = '{0}/@@{1}'.format(
            context.absolute_url(),
            action_url
        )
        return addTokenToUrl(action_url)


class UpgradeCleanupRunner(BrowserView):
    """ Migrate blog components to Python3

    Run custom handlers to cleanup the site
    """

    def __call__(self):
        alsoProvides(self.request, IDisableCSRFProtection)
        return self.render()

    def render(self):
        context = aq_inner(self.context)
        base_url = context.absolute_url()
        authenticator = getMultiAdapter((context, self.request),
                                        name=u"authenticator")
        next_url = '{0}/@@blog-upgrade?_authenticator={1}'.format(
            base_url, authenticator.token())
        self._cleanup_plone52()
        api.portal.show_message(
            message=_(u"The site has successfully been cleaned for Plone5.2.2"),
            request=self.request
        )
        return self.request.response.redirect(next_url)

    @staticmethod
    def _cleanup_plone52():
        upgrades.cleanup_in_plone52()
        upgrades.remove_ploneformgen()
        return


class MigrateBlogEntries(BrowserView):

    def render(self):
        context = aq_inner(self.context)
        migrated = []
        not_migrated = []
        import pdb; pdb.set_trace()
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
