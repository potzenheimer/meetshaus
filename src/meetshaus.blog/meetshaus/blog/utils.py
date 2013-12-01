from Acquisition import aq_inner
from Acquisition import aq_parent
from Acquisition import aq_base
from zope.component import getUtility
from zope.component import getMultiAdapter
from zope.component import ComponentLookupError
from plone.portlets.interfaces import IPortletAssignmentMapping
from plone.portlets.interfaces import IPortletManager


def find_portlet_assignment_context(assignment, context):
    # Finds the creation context of the assignment
    context = aq_inner(context)
    manager_name = assignment.manager.__name__
    assignment_name = assignment.__name__
    while True:
        try:
            manager = getUtility(IPortletManager,
                                 manager_name,
                                 context=context)
            mapping = getMultiAdapter((context, manager),
                                      IPortletAssignmentMapping)
            if assignment_name in mapping:
                if mapping[assignment_name] is aq_base(assignment):
                    return context
        except ComponentLookupError:
            pass
        parent = aq_parent(context)
        if parent is context:
            return None
        context = parent
