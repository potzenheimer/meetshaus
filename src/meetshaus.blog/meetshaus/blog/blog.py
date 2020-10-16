# -*- coding: UTF-8 -*-
""" Module providing folderish blog content type """
from plone.dexterity.content import Container
from plone.supermodel import model
from zope import schema
from zope.interface import implementer

from meetshaus.blog import MessageFactory as _


class IBlog(model.Schema):
    """
    Blog Content folder.
    """
    # form.widget(bio=WysiwygFieldWidget)
    bio = schema.Text(
        title=_(u'About the Author'),
        description=_(u'A short bio about the author of the blog.'),
        required=False,
    )


@implementer(IBlog)
class BlogPost(Container):
    pass
