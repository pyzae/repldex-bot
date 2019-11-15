# Configuration file for the Sphinx documentation builder

# boilerplate config for readthedocs.io as of writing, because i
# found out about their auto-documenting and decided to try it
#   - pyzae

# project info
project='ReplDex Bot'
author='pyzae, noah427, abc3354, et al'
copyright='2019; pyzae, noah427, abc3354, et al'

# versioning info
version='0.1'
release='0.1.2a'

# sphinx config
extensions=[
  'sphinx.ext.autodoc',
]

templates_path=['_templates']
exclude_patterns=[]
html_theme='classic'
