
define(['lib/socket.io.min', 'core/Stack'], function(io, Stack) {
    return {
        Flazh: class {
            constructor() {
                let sta = new Stack.Stack();
                this.stack = sta;

                let sock = io('http://127.0.0.1:5000'); // TODO rmme
                this.sock = sock;

                sock.emit('my_message', 'test334');
                console.log('original Flazh');
                $('body').append('<br>jQuery works, too!');
            }
        },
    };
});
