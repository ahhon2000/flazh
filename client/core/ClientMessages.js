define({

MSG_TYPES: [],
ClientMessages: class {
    constructor(flazh, ms, user, authKey) {
        this.MESSAGE_TYPES = ['draw'];
        this.user = user;
        this.authKey = authKey;

        if(rps.length === 0) throw new Error('No requests to send');
        this.flazh = flazh;

        for(let m of ms) {
            if(m.type === undefined) throw new Error('a client message is missing the type attribute');
            if(this.MESSAGE_TYPES.indexOf(m.type) < 0) throw new Error('unsupported client request type: ' + rp.type);
        }

        this.messages = ms;
    }

    send() {
        let fzh = this.flazh;
        let sock = fzh.sock;
        let ms = this.messages;

        let payload = {
            user: this.user,
            authKey: this.authKey,
            messages: ms,
        };

        sock.emit('client_messages', payload);
        console.log(ms.length + ' messages sent to the server');
    }
},

});
