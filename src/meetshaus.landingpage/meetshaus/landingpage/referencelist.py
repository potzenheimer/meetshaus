import random
from five import grok
from Acquisition import aq_inner
from Products.CMFCore.utils import getToolByName

from Products.CMFCore.interfaces import IFolderish
from Products.ATContentTypes.interfaces import IATLink


class ReferencesListing(grok.View):
    grok.context(IFolderish)
    grok.require('zope2.View')
    grok.name('references-listing')

    def update(self):
        self.has_links = len(self.contained_links()) > 0

    def sorted_results(self):
        results = self.contained_links()
        resultslist = list(results)
        return random.shuffle(resultslist)

    def contained_links(self):
        context = aq_inner(self.context)
        catalog = getToolByName(context, 'portal_catalog')
        results = catalog(object_provides=IATLink.__identifier__,
                         review_state='published')
        return results

    def random_size(self):
        size = 'sized-%s' % random.randint(1, 5)
        return size
