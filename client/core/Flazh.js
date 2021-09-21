define(
    [
        'lib/socket.io.min', 'core/Stack',
        'core/ClientMessageArray', 'core/ServerMessageArray'
    ],
    function(io, Stack, ClientMessageArray, ServerMessageArray) {

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

        this.MSG_TYPES_CLI = ['auth'];
        this.MSG_TYPES_SRV = ['auth'];

        this.clientMessageArrays = [];
        this.newClientMessageArray();

        Object.assign(this, kwarg);

        let uri = this.protocol + '://' + this.server + ':' + this.port;
        let sock = io(uri);
        this.sock = sock;

        sock.on('connect', () => {this.onReconnect()});
        sock.on('disconnect', () => {this.onDisconnect()});
        sock.on('server_message_array', (data) => {
            this.onServerMessageArray(data)
        });
    }

    newClientMessageArray() {
        let cma = new ClientMessageArray.ClientMessageArray(this);
        this.clientMessageArrays.push(cma);
    }

    login() {
        this.pushMessage({
            type: 'auth',
            user: this.user,
            authKey: this.authKey,
        });
        this.sendMessages();
    }

    onReconnect() {
        this.login();
    }

    onDisconnect() {
        console.log('disconnected');
    }

    onServerMessageArray(ms) {
        let sma = new ServerMessageArray.ServerMessageArray(this, ms);
        sma.processMessages()
    }

    onMessageArrayOutcome(cma) {
        let cmas = this.clientMessageArrays;
        let cmas2 = cmas.concat();
        cmas.length = 0;

        for(let cma2 of cmas2) {
            if(cma2 !== cma) {
                cmas.push(cma2);
            }
        }
    }

    pushMessage(m) {
        m = Object.assign({}, m);
        let cmas = this.clientMessageArrays;
        let cma = cmas[cmas.length-1];

        cma.pushMessage(m);
    }

    sendMessages() {
        let cmas = this.clientMessageArrays;
        let cma = cmas[cmas.length-1];
        cma.send();
        this.newClientMessageArray();
    }
};


return module;

}); // define
