define(['core/common'], function(common) {

let module = {};

module.Event = class {
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

        this.clientEventId = common.genRandomStr();

        this.funcsToExecOnIdAssignment = [];
    }

    execOnIdAssignment(f) {
        if(this.id === undefined) {
            this.funcsToExecOnIdAssignment.push(f);
        } else {
            f();
        }
    }

    createRequest(kwarg={}) {
        kwarg = Object.assign({cancel: false}, kwarg);

        if(kwarg.cancel && this.id === undefined) throw new Error('cannot cancel an event without its id');

        let m = {
            'type': undefined,
            'event': {
                'phrase_id': this.phrase.id,
                'type': this.type,
                'seconds': this.seconds,
                'correctAnswer': Boolean(this.correctAnswer),
            },
        };

        if(this.id === undefined) {
            m.type = 'new_event';
            m.clientEventId = this.clientEventId;
        } else {
            m.type = kwarg.cancel ? 'cancel_event' : 'edit_event';
            m['event'].id = this.id;
        }

        this.stack.pushMessage(m);
    }

    onNewEventResponse(rsp) {
        Object.assign(this, rsp['event']);

        if(this.id === undefined) throw new Error('failed to get the event id assigned by the server');

        for(let f of this.funcsToExecOnIdAssignment) {
            f();
        }
        this.funcsToExecOnIdAssignment = [];
    }

    cancel() {
        let thisObj = this;
        let stack = this.stack;

        if(this.type != 'answer') throw new Error('cannot cancel an event of this type: ' + this.type);

        this.execOnIdAssignment(function() {
            this.createRequest({cancel=true});
        });
    }

    edit(newVals) {
        if(this.type != 'answer') throw new Error('cannot edit a non-answer: ' + this.type);

        if(newVals.id !== undefined && this.id !== newVals.id) throw new Error('changing event id is not supported');

        Object.assign(this, newVals);

        this.execOnIdAssignment(function() {
            this.createRequest();
        });
    }
};

return module;

}); // define
