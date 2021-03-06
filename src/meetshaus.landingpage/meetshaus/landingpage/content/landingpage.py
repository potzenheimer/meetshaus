from zope import schema
from plone.directives import form

from meetshaus.landingpage import MessageFactory as _


class ILandingPage(form.Schema):
    """
    A landing page content type
    """
    # -*- Your Zope schema definitions here ... -*-

    form.widget(introduction="plone.app.z3cform.wysiwyg.WysiwygFieldWidget")
    introduction = schema.Text(
        title=_(u"Introduction"),
        description=_(u"Please enter introductional text that will be used on top of the landing page."),
        required=True,
    )

    form.widget(wordsbox="plone.app.z3cform.wysiwyg.WysiwygFieldWidget")
    wordsbox = schema.Text(
        title=_(u"Splashbox Words"),
        description=_(u"Field description"),
        required=False,
    )

    form.widget(adwordsbox="plone.app.z3cform.wysiwyg.WysiwygFieldWidget")
    adwordsbox = schema.Text(
        title=_(u"Splashbox Adwords"),
        description=_(u"Field description"),
        required=False,
    )

    form.widget(socialbox="plone.app.z3cform.wysiwyg.WysiwygFieldWidget")
    socialbox = schema.Text(
        title=_(u"Splashbox Social"),
        description=_(u"Field description"),
        required=False,
    )
