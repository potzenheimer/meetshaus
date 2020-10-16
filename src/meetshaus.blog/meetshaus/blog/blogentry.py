# -*- coding: UTF-8 -*-
""" Module providing blog entry dexterity content type """
from plone import api
from plone.app.layout.viewlets.interfaces import IBelowContentBody
from AccessControl import Unauthorized
from Acquisition import aq_inner, aq_parent
from plone.supermodel import model
from plone.event.utils import pydt

from plone.app.textfield import RichText

from plone.namedfile.interfaces import IImageScaleTraversable

from meetshaus.blog import MessageFactory as _


# Interface class; used to define content-type schema.

class IBlogEntry(model.Schema, IImageScaleTraversable):
    """
    A single blog entry for the rgd blog
    """
    text = RichText(
        title=_(u"Blog Entry"),
        description=_(u""),
        required=True,
    )
