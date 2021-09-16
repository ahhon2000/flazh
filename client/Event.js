
flazhGlob.Event = class {
    constructor(stack, phrase, kwarg) {
        this.stack = stack;
        this.phrase = phrase;
        Object.assign(this, kwarg);

        if(!phrase || phrase.id === undefined)
            throw new Error("event's phrase missing");

        if(['add', 'answer'].indexOf(this.type) < 0)
            throw new Error('unsupported event type: ' + this.type);

        let sec = this.seconds;
        if(sec !== undefined) {
            if(typeof(sec) != 'number' || /^[0-9]+$/.test(sec) || sec < 0)
                throw new Error('illegal timestamp: ' + sec);
        }

        this.clientEventId = Math.round(new Date().getTime()) + '_' +
            Math.round(Math.random() * 10e6);

        this.execOnIdAssignment = [];
    }

    makeRequest() {
        let rp = {
            'type': 'new_event',
            'clientEventId': this.clientEventId;
            'event': {
                'phrase_id': this.phrase.id,
                'type': this.type,
                'seconds': this.seconds,
                'correctAnswer': Boolean(this.correctAnswer),
            },
        };
        this.stack.request(rp);
    }

    onNewEventResponse(rsp) {
        Object.assign(this, rsp['event']);

        if(this.id === undefined) throw new Error('failed to get the event id assigned by the server');

        for(let f of this.execOnIdAssignment) {
            f();
        }
    }
}
