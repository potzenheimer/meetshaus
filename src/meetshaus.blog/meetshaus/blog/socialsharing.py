# -*- coding: UTF-8 -*-
""" Module providing a dexterity behavior for bloatless social sharing
    via buttons viewlet
"""
from Acquisition import aq_inner
from five import grok
from plone.app.layout.viewlets.interfaces import IBelowContent
from urllib import urlencode
from zope.interface import Interface


class ISocialSharing(Interface):
    """ Marker interface for social sharing enabled contents

        This interface is exposed to all content types providing
        IDexterityContent via bahavior
    """


class SocialSharingViewlet(grok.Viewlet):
    grok.context(ISocialSharing)
    grok.viewletmanager(IBelowContent)
    grok.require('zope2.View')
    grok.name('meetshaus.blog.SocialSharingViewlet')

    def encode_params(self, payload):
        return urlencode(payload)

    def compute_xing_params(self):
        context = aq_inner(self.context)
        url = context.absolute_url()
        params = 'app/user?op=share;sc_p=xing-share;url={0}'.format(url)
        return urlencode(params)
