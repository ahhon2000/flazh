define(function() {

let module = {
    MSG_TYPES_SRV: ['auth_success', 'error'],
};

module.ServerMessageArray = class {
    constructor(flazh, ms) {
        if(!Array.isArray(ms)) throw new Error('data received from the server is not an array');

        this.flazh = flazh;
        this.messages = ms.concat();
    }

    processMessages() {
        let ms = this.messages;
        for(let m of ms) {
            this.processMessage1(m);
        }
    }

    processMessage1(m) {
        let typ = m.type;
        if(module.MSG_TYPES_SRV.indexOf(typ) < 0) throw new Error('unsupported server message type: ' + typ);

        let h = this['on_' + typ];
        if(!h) throw new Error('no handler for server message type ' + typ);
        h(m);
    }

    on_auth_success(m) {
        console.log('authenticated!');
    }

    on_error(m) {
        let descr = m.descr;
        console.log('server error:', descr);
    }
};

return module;
});
