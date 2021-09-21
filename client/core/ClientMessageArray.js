define(function() {

let module = {
    ACK_TIMEOUT: 10000,
};

module.ClientMessageArray = class {
    constructor(flazh, ms=[]) {
        ms = ms.concat();
        this.flazh = flazh;
        this.messages = [];

        this.sent = false;
        this.processedByServer = false;
        this.timedOut = false;

        for(let m of ms) this.pushMessage(m);
    }

    pushMessage(m) {
        let fzh = this.flazh;

        if(this.sent) throw new Error('cannot add a message to an array that has already been sent');

        if(m.type === undefined) throw new Error('a client message is missing the type attribute');
        if(fzh.MSG_TYPES_CLI.indexOf(m.type) < 0) throw new Error('unsupported client message type: ' + m.type);

        this.messages.push(m);
    }

    onServerAck(kwarg={}) {
        kwarg = Object.assign({
            ack: false,
            data: undefined,
            timedOut: false,
        }, kwarg);
        
        let fzh = this.flazh;

        if(kwarg.ack) {
            if(kwarg.timedOut) throw new Error('ack & timedOut cannot be used together');
            this.processedByServer = true;
            console.log('server has processed messages: ', kwarg.data);
        } else {
            this.processedByServer = false;
            if(kwarg.timedOut) {
                console.log('server acknowledgement timed out');
                this.timedOut = true;
            } else {
                console.log('an error occurred on the server while processing messages');
            }
        }

        fzh.onMessageArrayOutcome(this);
    }

    send() {
        let thisObj = this;
        let fzh = this.flazh;
        let sock = fzh.sock;
        let ms = this.messages;

        if(this.sent) throw new Error('the client message array has already been sent');

        if(ms.length) {
            sock.emit('client_message_array', ms, (data) => {
                thisObj.onServerAck({'ack': true, 'data': data});
            });

            window.setTimeout((data) => {
                thisObj.onServerAck({timedOut: true});
            }, module.ACK_TIMEOUT);
        }

        this.sent = true;

        console.log(ms.length + ' messages sent to the server');
    }
};

return module;});
