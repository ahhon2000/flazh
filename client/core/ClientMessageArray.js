define(function() {

module = {
    MSG_TYPES: ['draw'],
};

module.ClientMessageArray = class {
    constructor(flazh, ms, user, authKey) {
        this.user = user;
        this.authKey = authKey;

        ms = ms.concat();

        if(ms.length === 0) throw new Error('No requests to send');
        this.flazh = flazh;

        for(let m of ms) {
            if(m.type === undefined) throw new Error('a client message is missing the type attribute');
            if(module.MSG_TYPES.indexOf(m.type) < 0) throw new Error('unsupported client request type: ' + m.type);
        }

        this.messages = ms;
    }

    send() {
        let fzh = this.flazh;
        let sock = fzh.sock;
        let ms = this.messages;

        let data = {
            user: this.user,
            authKey: this.authKey,
            messages: ms,
        };

        sock.emit('client_message_array', data);
        console.log(ms.length + ' messages sent to the server');
    }
};

return module;});
