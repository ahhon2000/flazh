import socketio
from pathlib import Path

FLAZH_ROOT_DIR = Path(__file__).absolute().parent.parent
DEBUG_PLACEHOLDER_FILE = FLAZH_ROOT_DIR / '.debug_placeholder'
DEBUG = DEBUG_PLACEHOLDER_FILE.exists()


class FlazhServer:
    def __init__(self, allowCors=True, **sock_kwarg):
        if allowCors:
            sock_kwarg['cors_allowed_origins'] = '*'

        self.sock = sock = socketio.Server(**sock_kwarg)
        self._setupHandlers()

        self.app = app = socketio.WSGIApp(sock,
            static_files = {
                '/': {'content_type': 'text/html', 'filename': 'index.html'},
            }
        )
    def _setupHandlers(self):
        sock = self.sock

        @sock.event
        def connect(sid, environ):
            print('connect ', sid)

        @sock.event
        def client_message(sid, data):
            print('client_message: ', data)
            sock.emit('server_message', f'got message: {data}', room=sid)

        @sock.event
        def disconnect(sid):
            print('disconnect ', sid)
