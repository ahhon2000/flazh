define(['core/Phrase'],
function(Phrase) {
return {

Stack: class {
    constructor(fzh) {
        this.flazh = fzh;

        this.previousPhrase = undefined;
        this.currentPhrase = undefined;
        this.nextPhrase = undefined;

        this.previousAnswer = undefined;

        this.draw(2);
        fzh.sendMessages();
    }

    pushMessage(m) {
        m = Object.assign({}, m, {
            stack_id: this.stack_id,
        });

        let fzh = this.fzh;
        fzh.pushMessage(m);
    }

    onAnswerCancellation(kwarg={}) {
        kwarg = Object.assign({sendMessages: true}, kwarg);

        let fzh = this.flazh;
        let a = this.previousAnswer;
        if(a) {
            a.cancel();
            this.previousAnswer = undefined;
        }

        if(kwarg.sendMessages) fzh.sendMessages();
    }

    onPostpone(h, kwarg={}) {
        kwarg = Object.assign({sendMessages: true}, kwarg);

        let fzh = this.flazh;
        let p = this.currentPhrase;
        if(p) {
            p.postpone(h);

            this.previousAnswer = undefined;
            this.previousPhrase = p;
            this.currentPhrase = this.nextPhrase;
            this.nextPhrase = undefined;

            this.draw(1);
        }

        if(kwarg.sendMessages) fzh.sendMessages();
    }

    onAnswerCancelAndPostpone(h, kwarg={}) {
        kwarg = Object.assign({sendMessages: true}, kwarg);

        let fzh = this.flazh;
        let p = this.previousPhrase;
        let a = this.previousAnswer;

        if(p && a) {
            this.onAnswerCancellation({sendMessages: false});
            p.postpone(h);
        }

        if(kwarg.sendMessages) fzh.sendMessages();
    }

    onAnswerEdit(newVals={}) {
        let fzh = this.flazh;
        let a = this.previousAnswer;
        if(a === undefined) return;
        a.edit(newVals);
        fzh.sendMessages();
    }

    onAnswer(corr) {
        let fzh = this.flazh;
        let p = this.currentPhrase;
        if(!p) return;

        let a = flazhGlob.Event(this, p, {
            type: 'answer',
            correctAnswer: corr,
        });

        a.createRequest();

        let nToDraw = this.nextPhrase ? 1 : 2;
        this.draw(nToDraw);

        this.previousAnswer = a;
        this.previousPhrase = p;
        this.currentPhrase = this.nextPhrase;
        this.nextPhrase = undefined;

        fzh.sendMessages();
    }

    onNewEventResponse(rsp) {
        if(rsp.errors.length) {
            throw new Error('Failed to submit the new event: ' +
                rsp.errors.join("\n")
            );
        }

        let a = this.previousAnswer;
        if(a && a.clientEventId == rsp.clientEventId) {
            a.onNewEventResponse(rsp);
        }
    }

    onDrawResponse(rsp) {
        if(rsp.errors.length) {
            throw new Error('Could not get phrases from the server: ' +
                rsp.errors.join("\n")
            );
        }

        ps = [];
        for(let p of rsp.phrases) {
            p = flazhGlob.Phrase(this, p);
            ps.push(p);
        }

        for(let pkey of ['currentPhrase', 'nextPhrase']) {
            let pval = this[pkey];
            if(!pval) {
                if(!ps.length) throw new Error('the server did not return enough phrases');
                this[pkey] = ps.pop();
            }
        }
    }

    draw(n=1) {
        if([1, 2].indexOf(n) < 0) throw new Error('Invalid number of flashcards to draw: ' + n);

        let exclude_phrases = [];
        if(this.nextPhrase) {
            exclude_phrases.push(this.nextPhrase.id);
        }

        this.pushMessage({
            'type': 'draw',
            'n': n,
            'exclude_phrases': exclude_phrases,
        });
    }
},

}; // module object
}); // define
