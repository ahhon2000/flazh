define(
    ['lib/socket.io.min', 'core/Stack', 'core/ClientMessages'],
    function(io, Stack, ClientMessages) {
        let module = {


Flazh: class {
    constructor(kwarg={}) {
        kwarg = Object.assign({
            protocol: 'https',
            server: '127.0.0.1',
            port: 5940,
            user: '',
            authKey: '',
        }, kwarg);

        if(['http', 'https', 'ws', 'wss'].indexOf(kwarg.protocol) < 0) throw new Error('a valid protocol must be specified, not ' + kwarg.protocol);

        if(!kwarg.server) throw new Error('a server must be given');
        if(!kwarg.user) throw new Error('a user must be given');

        Object.assign(this, kwarg);

        let uri = 'http://' + this.server + ':' + this.port;
        let sock = io(uri);
        this.sock = sock;

        this.msgQueue = [];
    }

    pushMessage(m) {
        m = Object.assign({}, m);
        this.msgQueue.push(m);
    }

    sendMessages() {
        let q = this.msgQueue;
        let cms = new ClientMessages.ClientMessages(
            this, this.msgQueue, this.user, this.authKey,
        );
        cms.send();

        q.length = 0;
    }
}, // class


//
// end of define
//
        }; // module
        return module;
    }
);
