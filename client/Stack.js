
requireScripts(['Phrase.js', 'ClientRequests.js'], function() {
    flazhGlob.Stack = class {
        constructor() {
            this.previousPhrase = undefined;
            this.currentPhrase = undefined;
            this.nextPhrase = undefined;

            this.previousEvent = undefined;

            this.reqQueue = [];

            this.draw(2);
            this.sendRequests();
        }

        onAnswer(corr) {
            let p = this.currentPhrase;
            if(!p) return;

            let e = flazhGlob.Event(this, p, {
                type: 'answer',
                correctAnswer: corr,
            });

            e.makeRequest();

            let nToDraw = this.nextPhrase ? 1 : 2;
            this.draw(nToDraw);

            this.sendRequests();

            this.previousEvent = e;
            this.previousPhrase = p;
            this.currentPhrase = this.nextPhrase;
            this.nextPhrase = undefined;
        }

        onNewEventResponse(rsp) {
            if(rsp.errors.length) {
                throw new Error('Failed to submit the new event: ' +
                    rsp.errors.join("\n");
                );
            }

            let e = this.previousEvent;
            if(e && e.clientEventId == rsp.clientEventId) {
                e.onNewEventResponse(rsp);
            }
        }

        onDrawResponse(rsp) {
            if(rsp.errors.length) {
                throw new Error('Could not get phrases from the server: ' +
                    rsp.errors.join("\n");
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

            this.request({
                'type': 'draw',
                'n': n,
                'exclude_phrases': exclude_phrases,
            });
        }

        request(rps) {
            // rps can be a dictionary of request parameters or an array of such
            // dictionaries
            if(!Array.isArray(rps)) rps = [rps];

            for(let rp of rps) {
                rp = Object.assign({}, rp);
                this.reqQueue.push(rp);
            }
        }

        sendRequests() {
            let r = new flazhGlob.ClientRequests(this.stack, this.reqQueue);
            r.send();
            this.reqQueue = [];
            console.log('requests sent to server');
        }
    };
});
