
requireScripts(['ClientRequests.js'], function() {
    flazhGlob.Stack = class {
        constructor() {
            this.previousPhrase = undefined;
            this.currentPhrase = undefined;
            this.nextPhrase = undefined;

            this.reqQueue = [];

            this.draw(2);
            this.sendRequests();
        }

        draw(n) {
            if([1, 2].indexOf(n) < 0) throw new Error('Invalid number of flashcards to draw: ' + n);

            let exclude_phrases = [];
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
