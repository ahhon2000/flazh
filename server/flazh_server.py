#!/usr/bin/python3
import sys, pathlib; d = pathlib.Path(__file__).resolve()
while d.parent != d and not (d / 'Common.py').exists(): d = d.parent
sys.path.count(str(d)) or sys.path.insert(0,str(d)); from Common import inclPath

from FlazhServer import FlazhServer, DEFAULT_PORT

server = FlazhServer()
app = server.app

if __name__ == '__main__':
    import eventlet
    eventlet.wsgi.server(eventlet.listen(('127.0.0.1', DEFAULT_PORT)), app)
