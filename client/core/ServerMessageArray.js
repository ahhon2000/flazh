define(function() {

let module = {};

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
        let fzh = this.flazh;

        if(fzh.MSG_TYPES_SRV.indexOf(typ) < 0) {
            console.warn('unsupported server message type: ' + typ);
        } else {
            let h = this['on_' + typ];
            if(!h) throw new Error('no handler for server message type ' + typ);
            h.call(this, m);
        }
    }

    on_auth(m) {
        let fzh = this.flazh;
        let st = m['status'];

        if(st === undefined) {
            throw new Error('the server returned no authentication status');
        } else if(st === 0) {
            for(let k of ['MSG_TYPES_SRV', 'MSG_TYPES_CLI']) {
                let mts0 = m[k];
                if(mts0 === undefined) throw new Error('the server did not provide ' + k + ' on authentication');

                let mts = fzh[k];
                mts.length = 0;
                mts.push(...mts0);
            }

            let descr = m.descr ? ' (status: ' + m.descr + ')' : '' ;
            console.log('authenticated' + descr);
        } else {
            let descr = m.descr ? ': ' + m.descr : '';
            throw new Error('authentication failed (status=' + st + ')' + descr);
        }
    }

    on_error(m) {
        let descr = m.descr;
        console.log('server error:', descr);
    }
};

return module;
});
