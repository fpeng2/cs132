#Socket.io

## Server side
The server side code is in ``server.js``, dealing with ``join``, 
``nickname``, ``message`` and ``disconnect``. The interesting part
lies in ``disconnect``, where sockets actually goes idle. Sockets
may disconnect and reconnect automatically. I simply ignored this
situations and act as if they are connected all the time. Only when
clients close the window will the actual disconnection happens.

## Client side
The client side code is in ``scripts.js``, dealing with new message,
member joining, member changing nickname, member leaving and emits
``join``, ``message``, ``nickname`` at proper time.

There are 3 panels in the chatroom view. Left shows the activity of
other members since the client joins the chatroom. Middle shows all
the messages, including history and coming ones. Right shows a list
of online members with there latest nickname.