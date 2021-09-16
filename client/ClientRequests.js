
flazhGlob.ClientRequests = class {
    constructor(stack, rps) {
        if(rps.length === 0) throw new Error('No requests to send');
        this.stack = stack;

        for(let rp of rps) {
            if([ 'draw', ].indexOf(rp.type) < 0) {
                throw new Error('unsupported client request type: ' + rp.type);
            }
        }

        this.reqPars = rps;
    }

    send() {
    }
}
