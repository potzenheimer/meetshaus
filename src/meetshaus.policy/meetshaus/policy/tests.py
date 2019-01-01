import unittest2 as unittest
from optilux.policy.testing import PRESSAPP_POLICY_INTEGRATION_TESTING

from Products.CMFCore.utils import getToolByName

class TestSetup(unittest.TestCase):
    
    layer = PRESSAPP_POLICY_INTEGRATION_TESTING
    
    def test_portal_title(self):
        portal = self.layer['portal']
        self.assertEqual("Meetshaus", portal.getProperty('title'))
    
    def test_portal_description(self):
        portal = self.layer['portal']
        self.assertEqual("Online Marketing, Social Media und Projektierung", portal.getProperty('description'))
