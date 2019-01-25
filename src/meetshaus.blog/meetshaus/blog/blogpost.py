# -*- coding: UTF-8 -*-
""" Module providing blog entry dexterity content type """

from AccessControl import Unauthorized
from Acquisition import aq_inner, aq_parent
from five import grok
from plone import api
from plone.app.layout.viewlets.interfaces import IBelowContentBody
from plone.app.z3cform.widget import AjaxSelectFieldWidget
from plone.autoform import directives
from plone.dexterity.content import Container
from plone.directives import form
from plone.event.utils import pydt
from plone.namedfile import field as named_file
from plone.namedfile.interfaces import IImageScaleTraversable
from plone.supermodel.directives import fieldset
from zope import schema
from zope.interface import implementer

from meetshaus.blog.utils import get_localized_month_name

from meetshaus.blog import MessageFactory as _


# Interface class; used to define content-type schema.
class IBlogPost(form.Schema, IImageScaleTraversable):
    """
    A single folderish blog post
    """
    # default fieldset
    title = schema.TextLine(
        title=_(u'Title'),
        description=_(u"Default content item title that will also be used as "
                      u"the meta data title tag"),
        required=True
    )

    # default meta data overrides
    headline = schema.TextLine(
        title=_(u'Headline'),
        description=_(u"Override the meta data title with a display title used "
                      u"in listings and views as main headline instead."
                      u"The headline also supports the use of soft hyphens "
                      u"(&shy;) for more control of small screen display"
        ),
        required=False
    )

    description = schema.Text(
        title=_(u'Summary'),
        description=_(u"Blog entry description used in listings and as meta "
                      u"data description"
        ),
        required=False,
    )

    # default meta data overrides
    abstract = schema.Text(
        title=_(u'Abstract'),
        description=_(u"Use the abstract tp override the default meta data "
                      u" description in listings and blog entry views."
        ),
        required=False,
    )

    fieldset(
        'media',
        label=_(u"Media"),
        fields=['image', 'image_caption', 'image_display']
    )

    image = named_file.NamedBlobImage(
        title=_(u"Cover image"),
        description=_(u"Please provide a preview image shown in listings and"
                      u"automatically provided to aggregation endpoints like"
                      u"social media channels (FB Graph API."),
        required=False
    )
    image_caption = schema.TextLine(
        title=_(u"Cover Image Caption"),
        required=False
    )

    image_display = schema.Bool(
        title=_(u"Display Cover image"),
        default=True,
        required=False
    )

    fieldset(
        'extra',
        label=_(u"Categorization"),
        fields=['subjects', ]
    )

    subjects = schema.Tuple(
        title=_(u'Categories'),
        description=_(u'Tags are commonly used for ad-hoc organization of ' +
                      u'content.'
        ),
        value_type=schema.TextLine(),
        required=False,
        missing_value=(),
    )
    directives.widget(
        'subjects',
        AjaxSelectFieldWidget,
        vocabulary='plone.app.vocabularies.Keywords'
    )


@implementer(IBlogPost)
class BlogPost(Container):
    pass
