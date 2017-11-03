from ._version import version_info, __version__

from .earth import *

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'ipyearth',
        'require': 'ipyearth/extension'
    }]
