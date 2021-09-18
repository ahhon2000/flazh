
define({
    Phrase: class {
        constructor(stack, kwarg) {
            this.stack = stack;
            Object.assign(this, kwarg);
            console.log('phrase constructor');
        }

        postpone(h) {
            if(isNaN(h)) throw new Error('the "hours" argument must be a number');
            h = parseInt(h);

            if(h <= 0) throw new Error('the "hours argument must be positive"');
            if(this.id === undefined) throw new Error('cannot postpone a phrase without id');

            let stack = this.stack;

            stack.request({
                'type': 'postpone_phrase',
                'h': h,
                'phrase_id': this.id,
            });
        }
    },
});
