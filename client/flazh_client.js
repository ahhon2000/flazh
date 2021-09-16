
let flazhGlob = {};

$(function() {
    requireScripts(['Stack.js', 'Stack.js', 'Stack.js'], function() {
        let sta = new flazhGlob.Stack();
        flazhGlob.stack = sta;
    });
});
