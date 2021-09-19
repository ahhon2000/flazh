define(function() {

module = {
    MSG_TYPES_CLI: ['auth', 'draw'],
};

module.ClientMessageArray = class {
    constructor(flazh, ms=[]) {
        ms = ms.concat();
        this.flazh = flazh;
        this.messages = [];

        for(let m of ms) this.pushMessage(m);
    }

    pushMessage(m) {
        if(m.type === undefined) throw new Error('a client message is missing the type attribute');
        if(module.MSG_TYPES_CLI.indexOf(m.type) < 0) throw new Error('unsupported client message type: ' + m.type);

        this.messages.push(m);
    }

    send() {
        let fzh = this.flazh;
        let sock = fzh.sock;
        let ms = this.messages;

        if(ms.length) {
            sock.emit('client_message_array', ms);
        }
        console.log(ms.length + ' messages sent to the server');
    }
};

return module;});
