import sys, os
from pathlib import Path
from itertools import chain

def inclPath(*dirs, defaults=('core')):
    """Add each directory in dirs to sys.path, unless it is already there

    Also, the parent dir of this file and defaults will be added, if absent.
    
    To use this function in an script put the following lines at the beginning:


    import sys, pathlib; d = pathlib.Path(__file__).resolve()
    while d.parent != d and not (d / 'Common.py').exists(): d = d.parent
    sys.path.count(str(d)) or sys.path.insert(0,str(d)); from Common import inclPath

    Then you can include paths relative to the main directory like this:

    inclPath('maintenance', 'maintenance/tests')

    """

    dirs = list(dirs)
    dirs.extend(defaults)

    p0 = Path(__file__).resolve().parent
    for p in chain((p0,), map(lambda d: p0 / d, dirs)):
        sp = str(p)
        if sp not in sys.path:
            sys.path.insert(0, sp)
