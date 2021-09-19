from ServerMessageArray import ServerMessageArray

MSG_TYPES_CLI = ('auth', 'draw',)

class ClientMessageArray:
    def __init__(self, fzhs, sid, ms):
        self.sid = sid
        self.messages = list(ms)
        self.flazhServer = fzhs

        self.serverMessageArray = None
        self._newServerMessageArray()

        self.user = None
        self.isAuthenticated = False

    def _newServerMessageArray(self):
        fzhs = self.flazhServer
        sid = self.sid
        self.serverMessageArray = ServerMessageArray(fzhs, sid)

    def processMessages(self):
        ms = self.messages

        for m in ms:
            try:
                self._processMessage1(m)
            except Exception as e:
                self.pushErrorMessage(str(e))

        self.sendMessages()

    def _processMessage1(self, m):
        if not isinstance(m, dict): raise Exception('client message not a dictionary')
        typ = m.get('type')
        if typ not in MSG_TYPES_CLI:
            raise Exception(f'unsupported message type: {typ}')

        if not self.isAuthenticated  and  typ != 'auth':
            raise Exception(f'Access denied')

        h = getattr(self, '_on_' + typ, None)
        if not h: raise Exception(f'no handler for message type={typ}')
        h(m)

    def _on_auth(self, m):
        u = str(m.get('user', ''))
        if not u: raise Exception('no user')

        authKey = str(m.get('authKey', ''))
        if not authKey: raise Exception('no authentication key')

        if (u, authKey) != ('1', 'emmooj4PWRejlBD5X12IZau9XdErXj9P'):
            raise Exception('wrong credentials')

        self.user = u
        self.isAuthenticated = True

        self.pushMessage({
            'type': 'auth_success',
        })

    def _on_draw(self, m):
        self.pushMessage({
            'type'
        })

    def pushErrorMessage(self, descr):
        sma = self.serverMessageArray
        sma.pushErrorMessage(descr)

    def pushMessage(self, m):
        sma = self.serverMessageArray
        sma.pushMessage(m)

    def sendMessages(self):
        sma = self.serverMessageArray
        sma.send()
        self._newServerMessageArray()
