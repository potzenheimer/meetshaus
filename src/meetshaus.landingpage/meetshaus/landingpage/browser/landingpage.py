from five import grok
from plone import api

from plone.app.contentlisting.interfaces import IContentListing

from meetshaus.blog.blogentry import IBlogEntry
from meetshaus.landingpage.content.landingpage import ILandingPage


class View(grok.View):
    grok.context(ILandingPage)
    grok.require('zope2.View')
    grok.name('view')

    def update(self):
        self.has_blogentries = len(self.blogentries()) > 0

    def blogentries(self):
        catalog = api.portal.get_tool(name='portal_catalog')
        items = catalog(object_provides=IBlogEntry.__identifier__,
                        review_state='published',
                        sort_on='effective',
                        sort_order='reverse',
                        limit=3)[:3]
        results = IContentListing(items)
        return results
