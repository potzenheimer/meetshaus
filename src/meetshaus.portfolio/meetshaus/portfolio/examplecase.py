from five import grok
from plone.directives import dexterity, form

from zope import schema
from zope.schema.interfaces import IContextSourceBinder
from zope.schema.vocabulary import SimpleVocabulary, SimpleTerm

from zope.interface import invariant, Invalid

from z3c.form import group, field

from plone.namedfile.interfaces import IImageScaleTraversable
from plone.namedfile.field import NamedImage, NamedFile
from plone.namedfile.field import NamedBlobImage, NamedBlobFile

from plone.app.textfield import RichText

from z3c.relationfield.schema import RelationList, RelationChoice
from plone.formwidget.contenttree import ObjPathSourceBinder

from meetshaus.portfolio import MessageFactory as _


class IExampleCase(form.Schema, IImageScaleTraversable):
    """
    A simple work example
    """
    url = schema.URI(
        title=_(u"Link"),
        description=_(u"Enter optional internal or external link"),
        required=False,
    )
    text = RichText(
        title=_(u"Case Summary"),
        description=_(u"Optional description of this example case"),
        required=False,
    )


class ExampleCase(dexterity.Item):
    grok.implements(IExampleCase)


class View(grok.View):
    grok.context(IExampleCase)
    grok.require('zope2.View')
    grok.name('view')
