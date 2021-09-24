from pathlib import Path as P; E=P.exists;R=P.resolve; l=R(P(__file__)).parents
with open(R(next(filter(E,(p/'cfg.py' for p in l))))) as _:exec(_.read())

inclPath('..')
import arraySocket
