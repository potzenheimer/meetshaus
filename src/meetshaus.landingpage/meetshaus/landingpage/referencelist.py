import random
from five import grok
from plone import api

from Products.CMFCore.interfaces import IFolderish
from Products.ATContentTypes.interfaces import IATLink


class ReferencesListing(grok.View):
    grok.context(IFolderish)
    grok.require('zope2.View')
    grok.name('references-listing')

    def update(self):
        self.has_links = len(self.contained_links()) > 0

    def filter_keys(self):
        catalog = api.portal.get_tool(name='portal_catalog')
        keys = catalog.uniqueValuesFor('Subject')
        return keys

    def computed_klass(self, item):
        keys = item.Subject
        klass = 'tilebox '
        for k in keys:
            formatted = k.replace(' ', '-').lower()
            new_klass = 'tilebox-{0} '.format(formatted)
            klass = klass + new_klass
        return klass

    def sorted_results(self):
        results = self.contained_links()
        resultslist = list(results)
        return random.shuffle(resultslist)

    def contained_links(self):
        catalog = api.portal.get_tool(name="portal_catalog")
        results = catalog(object_provides=IATLink.__identifier__,
                          review_state='published')
        return results

    def random_size(self):
        size = 'sized-%s' % random.randint(1, 5)
        return size
