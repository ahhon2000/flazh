
define(['socket.io.min.js', 'Stack'], function(io, Stack) {
    return {
        Flazh: class {
            constructor() {
                let sta = new Stack.Stack();
                this.stack = sta;
                let sock = io('http://127.0.0.1:5000'); // TODO rmme
                sock.emit('my_message', 'test334');
                console.log('original Flazh');
                $('body').append('<br>jQuery works, too!');
            }
        },
    };
});
