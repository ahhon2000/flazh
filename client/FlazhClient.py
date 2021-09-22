import threading
import time

import socketio
from . import ServerMessageArray, ClientMessageArray

SOCKET_REINIT_ON_FAILURE_SEC = 10

class FlazhClient:
    def __init__(self, uri="http://127.0.0.1:5490", **sock_kwarg):
        self.uri = uri
        self._evtStop = threading.Event()
        self.sock = None

        self.MSG_TYPES_CLI = ['auth']
        self.MSG_TYPES_SRV = ['auth']

        self.clientMessageArrays = {}
        self.curCliMessageArray = None
        self.newClientMessageArray()

    def newClientMessageArray(self):
        cma = ClientMessageArray(self)
        self.clientMessageArrays[cma.ref] = cma
        curCliMessageArray = cma

    def login(self):
        self.pushMessage({
            'type': 'auth',
            'user': self.user,
            'authKey': self.authKey,
        })
        self.sendMessages()

    def onReconnect(self):
        self.login()

    def onDisconnect():
        print('disconnected')
        

    def _initSocket(self):
        self.sock = sock = socketio.Client()

        @sock.event
        def connect():
            self.onReconnect()

        @sock.event
        def disconnect():
            self.onDisconnect()

        @sock.event
        def server_message_array(ms):
            onServerMessageArray(ms)

        return sock

    def onServerMessageArray(self, ms):
        try:
            sma = ServerMessageArray(self, ms)
            sma.processMessages()
        except Exception as e:
            print(f'error while processing messages: {e}')

    def discardCliMessageArray(self, cma):
        cmas = self.clientMessageArrays
        cmas.pop(cma.get('ref'), None)

    def pushMessage(self, m):
        cma = self.curCliMessageArray
        cma.pushMessage(m)

    def sendMessages(self):
        cma = self.curCliMessageArray
        cma.send()
        self.newClientMessageArray()

    def run(self):
        firstConnect = True

        while not self._evtStop.isSet():
            time.sleep(0 if firstConnect else SOCKET_REINIT_ON_FAILURE_SEC)
            firstConnect = False

            try:
                sock = self._initSocket(**sock_kwarg)
                sock.connect(self.uri)
                sock.wait()
            except Exception as e:
                print(f'socket error: {e}')

    def stop(self):
        self._evtStop.set()
