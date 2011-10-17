
from five import grok
from Acquisition import aq_inner
from Products.CMFCore.utils import getToolByName
from meetshaus.landingpage.content.landingpage import ILandingPage

class View(grok.View):
    grok.context(ILandingPage)
    grok.require('zope2.View')
    grok.name('view')
