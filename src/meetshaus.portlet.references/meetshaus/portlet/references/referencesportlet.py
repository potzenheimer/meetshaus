import random
from Acquisition import aq_inner
from zope.interface import implementer
from plone.portlets.interfaces import IPortletDataProvider
from plone.app.portlets.portlets import base

from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from Products.CMFCore.utils import getToolByName


class IReferencesPortlet(IPortletDataProvider):
    """A portlet
    It inherits from IPortletDataProvider because for this portlet, the
    data that is being rendered and the portlet assignment itself are the
    same.
    """


@implementer(IReferencesPortlet)
class Assignment(base.Assignment):
    """Portlet assignment.

    This is what is actually managed through the portlets UI and associated
    with columns.
    """

    def __init__(self):
        pass

    @property
    def title(self):
        """This property is used to give the title of the portlet in the
        "manage portlets" screen.
        """
        return "References Portlet"


class Renderer(base.Renderer):
    """Portlet renderer.

    This is registered in configure.zcml. The referenced page template is
    rendered, and the implicit variable 'view' will refer to an instance
    of this class. Other methods can be added and referenced in the template.
    """

    render = ViewPageTemplateFile('referencesportlet.pt')

    def available(self):
        return len(self._linkData()) > 0

    def selected_item(self):
        links = self._linkData()
        selected = random.choice(links)
        return selected

    def _linkData(self):
        context = aq_inner(self.context)
        catalog = getToolByName(context, 'portal_catalog')
        results = []
        return results


class AddForm(base.NullAddForm):
    """Portlet add form.
    """

    def create(self):
        return Assignment()
