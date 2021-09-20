#!/usr/bin/python3
import sys, pathlib; d = pathlib.Path(__file__).resolve()
while d.parent != d and not (d / 'Common.py').exists(): d = d.parent
sys.path.count(str(d)) or sys.path.insert(0,str(d)); from Common import inclPath

from pathlib import Path

from FlazhServer import FlazhServer, DEFAULT_PORT, DEBUG

SOCKET_PATH = Path('/tmp/flazh.sock')

server = FlazhServer()
app = server.app

if __name__ == '__main__':
    import eventlet
    l = None
    if DEBUG:
        l = eventlet.listen(('127.0.0.1', DEFAULT_PORT))
    else:
        sockPath = str(SOCKET_PATH)
        l = eventlet.listen(sockPath, eventlet.wsgi.socket.AF_UNIX)

    eventlet.wsgi.server(l, app)
