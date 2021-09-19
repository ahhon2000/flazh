define(
    ['lib/socket.io.min', 'core/Stack', 'core/ClientMessageArray'],
    function(io, Stack, ClientMessageArray) {

let module = {
    INSECURE_PROTOCOLS: ['http', 'ws',],
    SECURE_PROTOCOLS: ['https', 'wss',],
};
module.PROTOCOLS = module.INSECURE_PROTOCOLS.concat(module.SECURE_PROTOCOLS);

module.Flazh = class {
    constructor(kwarg={}) {
        kwarg = Object.assign({
            protocol: 'https',
            server: '127.0.0.1',
            port: 5490,
            user: '',
            authKey: '',
            debug: false,
        }, kwarg);

        if(module.PROTOCOLS.indexOf(kwarg.protocol) < 0) throw new Error('a valid protocol must be specified, not ' + kwarg.protocol);
        if(!kwarg.debug && module.SECURE_PROTOCOLS.indexOf(kwarg.protocol) < 0)
            throw new Error('this protocol can only be used in debugging mode :' + kwarg.protocol);

        if(!kwarg.server) throw new Error('a server must be given');
        if(!kwarg.user) throw new Error('a user must be given');

        Object.assign(this, kwarg);

        let uri = this.protocol + '://' + this.server + ':' + this.port;
        let sock = io(uri);
        this.sock = sock;

        sock.on('connect', () => {this.onConnect()});
        sock.on('server_message_array', (data) => {
            this.onServerMessageArray(data)
        });

        this.msgQueue = [];
    }

    onConnect() {
        console.log('connected; user =', this.user, this.authKey); // TODO rmme

        this.pushMessage({
            type: 'auth',
            user: this.user,
            authKey: this.authKey,
        });
        this.sendMessages();
    }

    onServerMessageArray(ms) {
        let sock = this.sock;
        console.log('server says: ', ms);
    }

    pushMessage(m) {
        m = Object.assign({}, m);
        this.msgQueue.push(m);
    }

    sendMessages() {
        let q = this.msgQueue;
        let cma = new ClientMessageArray.ClientMessageArray(
            this, this.msgQueue
        );
        cma.send();

        q.length = 0;
    }
};


return module;

}); // define
