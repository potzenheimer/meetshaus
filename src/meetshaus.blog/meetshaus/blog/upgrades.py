# -*- coding: utf-8 -*-
# Module providing version specific upgrade steps
import logging

from zope.globalrequest import getRequest
from plone import api
from plone.app.upgrade.utils import cleanUpSkinsTool

default_profile = 'profile-meetshaus.blog:default'
log = logging.getLogger(__name__)


def remove_ploneformgen(context=None):
    portal = api.portal.get()
    portal_types = api.portal.get_tool('portal_types')
    portal_catalog = api.portal.get_tool('portal_catalog')
    qi = api.portal.get_tool('portal_quickinstaller')

    log.info('removing PloneFormGen')
    old_types = [
        'FormFolder',
    ]
    old_types = [i for i in old_types if i in portal_types]
    for old_type in old_types:
        for brain in portal_catalog(portal_type=old_type):
            log.info(u'Deleting Existing Instances of {}!'.format(old_type))
            api.content.delete(brain.getObject(), check_linkintegrity=True)
    try:
        portal.manage_delObjects(['formgen_tool'])
    except AttributeError:
        pass
    try:
        portal.portal_properties.manage_delObjects(['ploneformgen_properties'])
    except BadRequest:
        pass

    if qi.isProductInstalled('PloneFormGen'):
        qi.uninstallProducts(['PloneFormGen'])

    if qi.isProductInstalled('Products.PloneFormGen'):
        qi.uninstallProducts(['Products.PloneFormGen'])


def migrate_ATBTreeFolder(context=None):
    """Replace very old containers for news, events and Members
    """
    from plone.portlets.interfaces import ILocalPortletAssignmentManager
    from plone.portlets.interfaces import IPortletManager
    from zope.component import getMultiAdapter
    from zope.component import queryUtility

    portal = api.portal.get()
    # create new containers:
    if not portal['Members'].__class__.__name__ == 'ATBTreeFolder':
        log.info('Migrating ATBTreeFolder not needed')
        return
    log.info('Migrating ATBTreeFolders')
    members_new = api.content.create(
        container=portal,
        type='Folder',
        id='members_new',
        title=u'Benutzer',
    )
    members_new.setOrdering('unordered')
    members_new.setLayout('@@member-search')
    # Block all right column portlets by default
    manager = queryUtility(IPortletManager, name='plone.rightcolumn')
    if manager is not None:
        assignable = getMultiAdapter(
            (members_new, manager),
            ILocalPortletAssignmentManager
        )
        assignable.setBlacklistStatus('context', True)
        assignable.setBlacklistStatus('group', True)
        assignable.setBlacklistStatus('content_type', True)


    for item in portal.Members.contentValues():
        api.content.move(
            source=item,
            target=members_new,
        )
    api.content.delete(obj=portal['Members'], check_linkintegrity=False)
    api.content.rename(obj=portal['members_new'], new_id='Members')


def uninstall_archetypes(context=None):
    portal = api.portal.get()
    request = getRequest()
    installer = api.content.get_view('installer', portal, request)
    addons = [
        'Archtypes',
        'ATContentTypes',
        'plone.app.referenceablebehavior',
        'plone.app.blob',
        'plone.app.imaging',
    ]
    for addon in addons:
        if installer.is_product_installed(addon):
            installer.uninstall_product(addon)


def remove_archetypes_traces(context=None):
    portal = api.portal.get()

    # remove obsolete AT tools
    tools = [
        'portal_languages',
        'portal_tinymce',
        'kupu_library_tool',
        'portal_factory',
        'portal_atct',
        'uid_catalog',
        'archetype_tool',
        'reference_catalog',
        'portal_metadata',
    ]
    for tool in tools:
        if tool not in portal.keys():
            log.info('Tool {} not found'.format(tool))
            continue
        try:
            portal.manage_delObjects([tool])
            log.info('Deleted {}'.format(tool))
        except Exception as e:
            log.info(u'Problem removing {}: {}'.format(tool, e))
            try:
                log.info(u'Fallback to remove without permission_checks')
                portal._delObject(tool)
                log.info('Deleted {}'.format(tool))
            except Exception as e:
                log.info(u'Another problem removing {}: {}'.format(tool, e))


def pack_database(context=None):
    """Pack the database"""
    portal = api.portal.get()
    app = portal.__parent__
    db = app._p_jar.db()
    db.pack(days=0)


def cleanup_in_plone52(context=None):
    migrate_ATBTreeFolder()
    uninstall_archetypes()
    remove_archetypes_traces()
    portal = api.portal.get()
    cleanUpSkinsTool(portal)
    qi = api.portal.get_tool('portal_quickinstaller')
    # Fix diazo theme
    qi.reinstallProducts(['plone.app.theming'])
    # Fix issue where we cannot pack the DB after it was migrated to Python 3
    qi.reinstallProducts(['plone.app.relationfield'])
    pack_database()


def upgrade_1001(setup):
    # Cleanup installation
    cleanup_in_plone52()
