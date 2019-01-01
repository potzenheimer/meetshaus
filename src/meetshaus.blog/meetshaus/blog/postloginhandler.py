# -*- coding: utf-8 -*-
"""Module providing post login event actions"""
from plone import api
from zope.globalrequest import getRequest


def post_login_redirect(event):
    """Listen to login event and perform custom redirect action"""
    portal = api.portal.get()
    portal_url = portal.absolute_url()
    target_url = "{0}/blog/".format(portal_url)
    request = getRequest()
    if request is None:
        # Probably called by a test or something unexpected happening
        return
    if request.get("came_from", None):
        request["came_from"] = ""
        request.form["came_from"] = ""
        # Keep potential came from variable in tact.
    request.RESPONSE.redirect(target_url)
