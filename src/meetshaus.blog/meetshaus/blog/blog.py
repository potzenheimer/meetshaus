from five import grok
from Acquisition import aq_inner
import calendar
from DateTime import DateTime
from plone.directives import dexterity, form
from zope import schema
from z3c.form import group, field
from plone.app.z3cform.wysiwyg import WysiwygFieldWidget
from Products.CMFCore.utils import getToolByName
from Products.CMFPlone.PloneBatch import Batch
try:
    from plone.app.discussion.interfaces import IConversation
    USE_PAD = True
except ImportError:
    USE_PAD = False

from plone.app.contentlisting.interfaces import IContentListing
from meetshaus.blog.blogentry import IBlogEntry

from meetshaus.blog import MessageFactory as _


class IBlog(form.Schema):
    """
    Blog Content folder.
    """
    
    form.widget(bio=WysiwygFieldWidget)
    bio = schema.Text(
        title=_(u'About the Author'),
        description=_(u'A short bio about the author of the blog.'),
        required=False,
    )

class BlogView(grok.View):
    grok.context(IBlog)
    grok.require('zope2.View')
    grok.name('blog-view')
    
    def blogitems(self):
        """List all blog items as brains"""
        year = int(self.request.form.get('year',0))
        month = int(self.request.form.get('month',0))
        subject = self.request.form.get('category', None)
        return self.get_entries(year=year, month=month, subject=subject)
    
    def batch(self):
        b_size = 5
        b_start = self.request.form.get('b_start', 0)
        return Batch(self.blogitems(), b_size, b_start, orphan=1)
    
    def commentsEnabled(self, ob):
        if USE_PAD:
            conversation = IConversation(ob)
            return conversation.enabled()
        else:
            return self.portal_discussion.isDiscussionAllowedFor(ob)
    
    def commentCount(self, ob):
        if USE_PAD:
            conversation = IConversation(ob)
            return len(conversation)
        else:
            discussion = self.portal_discussion.getDiscussionFor(ob)
            return discussion.replyCount(ob)
    
    
    def _base_query(self):
        context = aq_inner(self.context)
        obj_provides = IBlogEntry.__identifier__
        path = '/'.join(context.getPhysicalPath())
        return dict(path={'query': path, 'depth':1},
                    object_provides=obj_provides,
                    sort_on='effective', sort_order='reverse')
    
    def get_entries(self, year=None, month=None, subject=None):
        context = aq_inner(self.context)
        catalog = getToolByName(context, 'portal_catalog')
        query = self._base_query()
        if subject:
            query['Subject'] = subject
        if year:
            if month:
                lastday = calendar.monthrange(year, month)[1]
                startdate = DateTime(year, month, 1, 0, 0)
                enddate = DateTime(year, month, lastday, 23, 59, 59)
            else:
                startdate = DateTime(year, 1, 1, 0, 0)
                enddate = DateTime(year, 12, 31, 0, 0)
            query['effective'] = dict(query=(startdate, enddate),
                                      range='minmax')
        results = catalog.searchResults(**query)
        return IContentListing(results)
