# -*- coding: UTF-8 -*-
""" Module providing a dexterity behavior for bloatless social sharing
    via buttons viewlet
"""
from future import standard_library
standard_library.install_aliases()
from Acquisition import aq_inner
from plone.app.layout.viewlets.interfaces import IBelowContent
from urllib.parse import urlencode
from zope.interface import Interface


class ISocialSharing(Interface):
    """ Marker interface for social sharing enabled contents

        This interface is exposed to all content types providing
        IDexterityContent via bahavior
    """
