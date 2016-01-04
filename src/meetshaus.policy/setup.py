from setuptools import setup, find_packages
import os

version = '1.0'

setup(name='meetshaus.policy',
      version=version,
      description="Policy product for the meetshaus site.",
      long_description=open("README.txt").read() + "\n" +
                       open(os.path.join("docs", "HISTORY.txt")).read(),
      # Get more strings from
      # http://pypi.python.org/pypi?:action=list_classifiers
      classifiers=[
        "Framework :: Plone",
        "Programming Language :: Python",
        ],
      keywords='',
      author='Vorwaerts Werbung GbR',
      author_email='hallo@vorwaerts-werbung.de',
      url='http://dist.vorwaerts-werbung.de',
      license='GPL',
      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['meetshaus'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
          'meetshaus.blog',
          'meetshaus.landingpage',
          'meetshaus.sitetheme',
          # -*- Extra requirements: -*-
      ],
      entry_points="""
      # -*- Entry points: -*-

      [z3c.autoinclude.plugin]
      target = plone
      """,
      )
