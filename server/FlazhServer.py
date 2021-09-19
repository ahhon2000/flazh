import socketio
from pathlib import Path

FLAZH_ROOT_DIR = Path(__file__).absolute().parent.parent
DEBUG_PLACEHOLDER_FILE = FLAZH_ROOT_DIR / '.debug_placeholder'
DEBUG = DEBUG_PLACEHOLDER_FILE.exists()


class FlazhServerBase:
    eventHandlers = set()

    @classmethod
    def evtHandler(Cls, f):
        Cls.eventHandlers.add(f.__name__)
        return f

evtHandler = FlazhServerBase.evtHandler


class FlazhServer(FlazhServerBase):

    def __init__(self, allowCors=False, **sock_kwarg):
        super().__init__()
        if allowCors:
            if not DEBUG: raise Exception(f'the allowCors flag can only be used in DEBUG mode')
            sock_kwarg['cors_allowed_origins'] = '*'

        self.sock = sock = socketio.Server(**sock_kwarg)

        for e, hn in sorted(self.eventHandlers):
            h = getattr(self, hn)
            sock.on(e, handler=h)

        self.app = app = socketio.WSGIApp(sock,
            static_files = {
                '/': {'content_type': 'text/html', 'filename': 'index.html'},
            }
        )

        @evtHandler
        def connect(self, sid, environ):
            sock = self.sock
            print('connect ', sid)

        @evtHandler
        def my_message(self, sid, data):
            sock = self.sock
            print('message ', data)
            sock.emit('message_response', f'server says: got message: {data}', room=sid)

        @evtHandler
        def disconnect(self, sid):
            sock = self.sock
            print('disconnect ', sid)
