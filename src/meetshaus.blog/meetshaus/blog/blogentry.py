from five import grok
from AccessControl import Unauthorized
from Acquisition import aq_inner, aq_parent
from plone.directives import form

from plone.app.textfield import RichText

from plone.namedfile.interfaces import IImageScaleTraversable

from meetshaus.blog import MessageFactory as _


# Interface class; used to define content-type schema.

class IBlogEntry(form.Schema, IImageScaleTraversable):
    """
    A single blog entry for the rgd blog
    """
    text = RichText(
        title=_(u"Blog Entry"),
        description=_(u""),
        required=True,
    )


class BlogEntryView(grok.View):
    grok.context(IBlogEntry)
    grok.require('zope2.View')
    grok.name('view')

    def parent_info(self):
        context = aq_inner(self.context)
        parent = aq_parent(context)
        try:
            if (getattr(parent, 'getId', None) is None or
                    parent.getId() == 'talkback'):
                # Skip any Z3 views that may be in the acq tree;
                # Skip past the talkback container if that's where we are
                parent = aq_parent(aq_inner(parent))
            return parent
        except Unauthorized:
            return None
