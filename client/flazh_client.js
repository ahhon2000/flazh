
let flazhGlob = {};

$(function() {
    requireScripts(['Stack.js'], function() {
        let sta = new flazhGlob.Stack();
        flazhGlob.stack = sta;
    });
});
