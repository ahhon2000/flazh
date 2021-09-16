
let flazhGlob = {};

$(function() {
    requireScripts(['Stack.js', 'Phrase.js'], function() {
        let sta = new flazhGlob.Stack();
        flazhGlob.flazh = sta;

        let p = new flazhGlob.Phrase(sta);
    });
});
