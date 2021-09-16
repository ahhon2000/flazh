
let flazhGlob = {};

$(function() {
    requireScripts(['Flazh.js', 'Phrase.js'], function() {
        let fzh = new Flazh();
        flazhGlob.flazh = fzh;

        let p = new Phrase(fzh);
    });
});
