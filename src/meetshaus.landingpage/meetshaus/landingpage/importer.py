# -*- coding: utf-8 -*-

import string
import StringIO
import csv
import transaction
from logging import getLogger
from Acquisition import aq_inner
from five import grok

from zope.lifecycleevent import modified
from zope.component import getUtility

from plone.directives import form
from z3c.form import button
from z3c.relationfield import RelationValue

from plone import api
from plone.namedfile import field as namedfile
from plone.dexterity.utils import createContentInContainer

from Products.CMFPlone.utils import safe_unicode

from plone.i18n.normalizer.interfaces import IIDNormalizer

from Products.statusmessages.interfaces import IStatusMessage
from plone.app.layout.navigation.interfaces import INavigationRoot

from meetshaus.landingpage import MessageFactory as _

# Cleanup potentially bad chars from the system
MULTISPACE = u'\u3000'.encode('utf-8')
NBSPACE = u'\xa0'.encode('utf-8')


def quote_chars(s):
    if MULTISPACE in s:
        s = s.replace(MULTISPACE, ' ')
    if NBSPACE in s:
        s = s.replace(NBSPACE, '')
    return s


class IDomainImport(form.Schema):
    """ Domain list import schema """

    csvfile = namedfile.NamedFile(
        title=_(u"File Upload"),
        description=_(u"Please upload a file in csv format containing the "
                      u"domain information to be imported and analysed."),
        required=True,
    )


class DomainImportForm(form.SchemaForm):
    grok.context(INavigationRoot)
    grok.require('cmf.ManagePortal')
    grok.name('import-shopcontent')

    schema = IDomainImport
    ignoreContext = True

    label = _(u"Shop Content Import Form")
    description = _(u"Upload shop contents by supplying a csv file.")

    def update(self):
        self.request.set('disable_border', True)
        super(DomainImportForm, self).update()

    @button.buttonAndHandler(_(u"Import"))
    def handleApply(self, action):
        data, errors = self.extractData()
        if errors:
            self.status = self.formErrorsMessage
            return

        # Process uploaded file and import recipients
        importdata = data['csvfile'].data
        imported_records = self.importItems(importdata)
        if imported_records is not None:
            IStatusMessage(self.request).addStatusMessage(
                _(u"Imported records: ") + unicode(imported_records),
                type='info')

    def importItems(self, data):
        context = aq_inner(self.context)
        logger = getLogger('ShopContentImport')
        io = StringIO.StringIO(data)
        reader = csv.reader(io, delimiter=';', dialect="excel", quotechar='"')
        header = reader.next()
        processed_records = 0
        transaction_threshold = 50
        # com/net/org Domains
        # ohne Bindestrich im Domainnamen
        for row in reader:
            code = self.getSpecificRecord(header, row, name=u'productCode')
            title = self.getSpecificRecord(header, row, name=u'title_de')
            title_en = self.getSpecificRecord(header, row, name=u'title_en')
            data = {
                'title': title,
                'title_de': title,
                'title_en': title_en,
                'productCode': code}
            if not code:
                logger.info('Product code missing for record %s' % title)
            else:
                logger.info('Processing file: %s' % title)
                item = createContentInContainer(
                    context,
                    'chromsystems.shopcontent.orderableitem',
                    checkConstraints=True, **data)
                modified(item)
            processed_records += 1
            if processed_records % transaction_threshold == 0:
                transaction.commit()
        return processed_records

    def importItemCollections(self, data):
        context = aq_inner(self.context)
        logger = getLogger('ShopContentImport')
        io = StringIO.StringIO(data)
        reader = csv.reader(io, delimiter=';', dialect="excel", quotechar='"')
        header = reader.next()
        processed_records = 0
        transaction_threshold = 50
        for row in reader:
            code = self.getSpecificRecord(header, row, name=u'productCode')
            title = self.getSpecificRecord(header, row, name=u'title_de')
            title_en = self.getSpecificRecord(header, row, name=u'title_en')
            product_ids = self.getSpecificRecord(header, row,
                                                 name=u"orderable_items")
            keywords = self.getSpecificRecord(header, row, name=u'keywords')
            category = self.getSpecificRecord(header, row, name=u'category')
            subcategory = self.getSpecificRecord(header, row,
                                                 name=u'subcategory')
            link_de = self.getSpecificRecord(header, row, name=u'link_de')
            link_en = self.getSpecificRecord(header, row, name=u'link_en')
            cleaned_cats = self.cleanupRecords(subcategory, delimiter=',')
            cleaned_cats.append(category)
            clean_ids = self.cleanupRecords(product_ids, delimiter=',')
            keys = self.cleanupRecords(keywords, delimiter=',')
            subjects = [safe_unicode(k) for k in keys]
            relations = self.prepareRelatedProducts(clean_ids)
            itemorder = self.getItemOrder(clean_ids)
            data = {
                'title': title,
                'title_de': title,
                'title_en': title_en,
                'orderCode': code,
                'category': cleaned_cats,
                'link_de': link_de,
                'link_en': link_en,
                'relatedProducts': relations,
                'layout_order': itemorder}
            if not code:
                logger.info('Product code missing for record %s' % title)
            else:
                logger.info('Processing file: %s' % title)
                item = createContentInContainer(
                    context,
                    'chromsystems.shopcontent.itemcollection',
                    checkConstraints=True, **data)
                item.setSubject(subjects)
                modified(item)
            processed_records += 1
            if processed_records % transaction_threshold == 0:
                transaction.commit()
        return processed_records

    def prepareRelatedProducts(self, product_ids):
        """ Compare provided product ids with the catalog brains of
            orderable items and provide a list of RelationValue objects

            @param product_ids: a list() of productCode values
        """
        products = self._getAvailableItems()
        relations = []
        for i in product_ids:
            target_id = products.get(i)
            relation = RelationValue(target_id)
            relations.append(relation)
        return relations

    def getItemOrder(self, product_ids):
        catalog = api.portal.get_tool(name=u"portal_catalog")
        order = list()
        for pid in product_ids:
            items = catalog(productCode=pid)
            if len(items) > 0:
                item = items[0]
                uuid = item.UID
                order.append(uuid)
        return order

    def getSpecificRecord(self, header, row, name):
        """ Process a specific record in the import file accessing
            a specific cell by its name
        """
        assert type(name) == unicode
        index = None
        for i in range(0, len(header)):
            if header[i].decode("utf-8") == name:
                index = i
        if index is None:
            raise RuntimeError(
                "Uploaded file does not have the column:" + name)
        record = quote_chars(row[index]).decode('utf-8')
        return record

    def cleanupRecords(self, records, delimiter, normalize_records=None):
        normalizer = getUtility(IIDNormalizer)
        cleaned_records = []
        for entry in string.split(records, delimiter):
            if normalize_records is not None:
                record = normalizer.normalize(entry)
            else:
                record = entry
            cleaned_records.append(record)
        return cleaned_records

    def is_ascii(self, s):
        for c in s:
            if not ord(c) < 128:
                return False
        return True
