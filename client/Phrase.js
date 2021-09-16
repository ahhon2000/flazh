
flazhGlob.Phrase = class {
    constructor(stack, kwarg) {
        this.stack = stack;
        Object.assign(this, kwarg);
        console.log('phrase constructor');
    }
}
