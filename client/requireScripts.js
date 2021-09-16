
function scriptHasBeenLoaded(src) {
    return Boolean(document.querySelector('script[src="' + src + '"]'));
}

function requireScripts(srcs, f) {
    if(typeof(srcs) === 'string') srcs = [srcs];

    let leftToLoad = srcs.length;

    function onload() {
        leftToLoad--;
        if(leftToLoad == 0) f();
    }

    for(let src of srcs) {
        if(scriptHasBeenLoaded(src)) {
            onload();
        } else {
            let s = document.createElement('script');
            s.src = src;
            s.onload = onload;
            document.head.appendChild(s);
        }
    }
}
