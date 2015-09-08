# -*- coding: utf-8 -*-
"""Module providing subject widget adapter"""
from collective.z3cform.widgets.token_input_widget import TokenInputFieldWidget
from plone.app.dexterity.behaviors.metadata import ICategorization
from plone.app.z3cform.interfaces import IPloneFormLayer
from z3c.form.interfaces import IFieldWidget
from z3c.form.util import getSpecification
from z3c.form.widget import FieldWidget
from zope.component import adapter
from zope.interface import implementer


@adapter(getSpecification(ICategorization['subjects']), IPloneFormLayer)
@implementer(IFieldWidget)
def SubjectsFieldWidget(field, request):
    widget = FieldWidget(field, TokenInputFieldWidget(field, request))
    return widget
