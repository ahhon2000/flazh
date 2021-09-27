try: from pathlib import Path as P; R = P.resolve; E = P.exists; \
    L = lambda p: p / 'cfg.py'; F = R(P(__file__)); import handyPyUtil
except: O=open(R(next(filter(E,map(L,F.parents))))); exec(O.read()); O.close()

inclPath('..')
import arraySocket
