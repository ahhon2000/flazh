import socketio
from pathlib import Path

from ServerMessageArray import ServerMessageArray
from ClientMessageArray import ClientMessageArray

FLAZH_ROOT_DIR = Path(__file__).absolute().parent.parent
DEBUG_PLACEHOLDER_FILE = FLAZH_ROOT_DIR / '.debug_placeholder'
DEBUG = DEBUG_PLACEHOLDER_FILE.exists()
DEFAULT_PORT = 5490

class FlazhServer:
    def __init__(self, allowCors=True, **sock_kwarg):
        if allowCors:
            sock_kwarg['cors_allowed_origins'] = '*'

        self.sock = sock = socketio.Server(**sock_kwarg)
        self._setupSocketHandlers()

        self.app = app = socketio.WSGIApp(sock,
            static_files = {
                '/': {'content_type': 'text/html', 'filename': 'index.html'},
            }
        )

    def _setupSocketHandlers(self):
        sock = self.sock

        @sock.event
        def connect(sid, environ):
            print('connect ', sid)

        @sock.event
        def client_message_array(sid, data):
            try:
                cma = ClientMessageArray(self, sid, data)
                cma.processMessages()
            except Exception as e:
                m = {
                    'type': 'error',
                    'descr': str(e),
                }
                sma = ServerMessageArray(self, sid, [m])
                sma.send()
            return "ack"

        @sock.event
        def disconnect(sid):
            print('disconnect ', sid)
