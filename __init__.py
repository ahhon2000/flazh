try:from pathlib import Path as P;R=P.resolve;E=P.exists; F = R(P(__file__));\
    L = lambda p: p / 'cfg.py'; from handyPyUtil import inclPath
except: O=open(R(next(filter(E,map(L,F.parents))))); exec(O.read()); O.close()

inclPath('..')
import arraySocket
