#!/usr/bin/python3

import eventlet
import socketio

sio = socketio.Server(
    cors_allowed_origins='*',  # TODO rm this when js is served over http, https
)

app = socketio.WSGIApp(sio, static_files={
    '/': {'content_type': 'text/html', 'filename': 'index.html'}
})

@sio.event
def connect(sid, environ):
    print('connect ', sid)

@sio.event
def my_message(sid, data):
    print('message ', data)
    sio.emit('message_response', f'server says: got message: {data}', room=sid)

@sio.event
def disconnect(sid):
    print('disconnect ', sid)

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('127.0.0.1', 5000)), app)
