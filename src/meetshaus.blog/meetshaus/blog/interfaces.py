# -*- coding: UTF-8 -*-
"""Blog tool interfaces"""

from zope import schema
from zope.interface import Interface
from meetshaus.blog import MessageFactory as _


class IBlogTool(Interface):
    """ A marker inteface for a specific theme layer """


class IBlogToolSettings(Interface):
    """Global data stored in the registry"""

    blog_categories = schema.TextLine(
        title=_(u"Blog Category JSON File")
    )


class IContentInfoProvider(Interface):

    def reading_time(self):
        """ Get estimated reading time.

        @return: a time value in minutes
        """
