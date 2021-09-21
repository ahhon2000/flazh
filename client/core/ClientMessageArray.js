define(['core/common'], function(common) {

let module = {
    ACK_TIMEOUT_SEC: 10,
    DFLT_SEC_TO_LIVE: 60,
};

module.ClientMessageArray = class {
    constructor(flazh, ms=[]) {
        this.ref = common.genRandomStr();

        ms = ms.concat();
        this.flazh = flazh;
        this.messages = [];

        this.sent = false;
        this.processedByServer = false;
        this.timedOut = false;
        this.expired = false;

        this.secToLive = module.DFLT_SEC_TO_LIVE;

        this.callbacks = {};

        for(let m of ms) this.pushMessage(m);
    }

    pushMessage(m) {
        // If m.responseValidForSec is given
        // (and is greater than other messages', or the default value)
        // it sets for how many seconds to keep this ClientMessageArray after
        // it is sent to the server.
        //
        // If a function is provided as m.callback it will be kept in this
        // object until it times out/expires, so that the server can trigger
        // it, if necessary.

        let fzh = this.flazh;

        if(this.sent) throw new Error('cannot add a message to an array that has already been sent');

        if(m.type === undefined) throw new Error('a client message is missing the type attribute');
        if(fzh.MSG_TYPES_CLI.indexOf(m.type) < 0) throw new Error('unsupported client message type: ' + m.type);

        m = Object.assign({}, m);

        m.clientMessageArray = this.ref;

        let vsec = m.responseValidForSec;
        if(vsec && vsec > this.secToLive) {
            this.secToLive = vsec;
        }

        let cb = m.callback;
        if(cb) {
            let cbk = common.genRandomStr();
            this.callbacks[cbk] = cb;
            m.callback = cbk;
        }

        this.messages.push(m);
    }

    onStatusChange(kwarg={}) {
        kwarg = Object.assign({
            ack: false,
            data: undefined,
            timedOut: false,
            expired: false,
        }, kwarg);
        
        let fzh = this.flazh;

        if(kwarg.ack && kwarg.timedOut) throw new Error('ack & timedOut cannot be used together');
        if(kwarg.ack && kwarg.expired) throw new Error('ack & expired cannot be used together');

        if(kwarg.ack) {
            this.processedByServer = true;
            console.log('server has processed messages: ', kwarg.data);
        }

        if(kwarg.timedOut) {
            this.timedOut = true;
            console.warn('server acknowledgement timed out');
        }
        if(kwarg.expired) {
            this.expired = true;
        }

        if(this.timedOut || this.expired ||
            this.processedByServer && !this.callbacksPending()
        ) {
            fzh.discardCliMessageArray(this);
        }
    }

    callbacksPending() {
        return Boolean(Object.keys(this.callbacks).length);
    }

    send() {
        let thisObj = this;
        let fzh = this.flazh;
        let sock = fzh.sock;
        let ms = this.messages;

        if(this.sent) throw new Error('the client message array has already been sent');

        if(ms.length) {
            sock.emit('client_message_array', ms, (data) => {
                thisObj.onStatusChange({'ack': true, 'data': data});
            });

            window.setTimeout(() => {
                if(!thisObj.processedByServer) {
                    thisObj.onStatusChange({timedOut: true});
                }
            }, module.ACK_TIMEOUT_SEC * 1000);
        }

        window.setTimeout(() => {
            thisObj.onStatusChange({expired: true});
        }, thisObj.secToLive * 1000);

        this.sent = true;

        console.log(ms.length + ' messages sent to the server');
    }

    execCallback(cbk, m) {
        let cb = this.callbacks[cbk];
        if(!cb) throw new Error('the callback requested by the server is unavailable');

        delete this.callbacks[cbk];

        cb.call(this, m);

        this.onStatusChange();
    }
};

return module;});
