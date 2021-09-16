

let rscrGlob = {
    nLeftToLoad: 0,
    funcQueue: [],
    onload: function() {
        rscrGlob.nLeftToLoad--;
        if(!rscrGlob.nLeftToLoad) {
            let q = rscrGlob.funcQueue;
            while(q.length) {
                let f = q.pop();
                if(f !== undefined) f();
            }
        }
    },
};

function scriptHasBeenLoaded(src) {
    return Boolean(document.querySelector('script[src="' + src + '"]'));
}

function requireScripts(srcs, f=undefined) {
    if(typeof(srcs) === 'string') srcs = [srcs];

    rscrGlob.nLeftToLoad += srcs.length;
    rscrGlob.funcQueue.push(f);

    for(let src of srcs) {
        if(scriptHasBeenLoaded(src)) {
            rscrGlob.onload();
        } else {
            let s = document.createElement('script');
            s.src = src;
            s.onload = rscrGlob.onload;
            document.head.appendChild(s);
        }
    }
}
