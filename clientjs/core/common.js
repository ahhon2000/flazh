define(function() {

let module = {};

let abc = "";
for(let [baseChar, n] of [
    ['0', 10], ['a', 26], ['A', 26],
]) {
    let baseCode = baseChar.charCodeAt(0);
    for(let i=0; i<n; i++) {
        abc += String.fromCharCode(baseCode + i);
    }
}

module.ABC = abc;

module.genRandomStr = function(k=24) {
    let abc = module.ABC;
    let n = abc.length;
    let s = '';
    for(let i=0; i<k; i++) {
        let j = Math.floor(Math.random() * n);
        s += abc[j];
    }

    return s;
};

let x = module.genRandomStr();

return module;

});
