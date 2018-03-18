#Chatroom

##Overview
The project is based on Node.js, install the project according to package.json.

The Chatrooms application includes 2 main webpages. Users start from '/' or '/index'
to access homepage, where users can create a new chatroom or enter existing chatrooms
through IDs. Users are asked for a nickname when they enter a chatroom. In a chatroom, 
People will see all history messages. They can start sending messages and messages will
display to everyone else online in this chatroom.

##Index 
The index page contains an entry panel and a display panel. In the entry panel, one can
create a chatroom or enter a room with ID. Once they click on a button, they are asked 
to enter a nickname. If user clicks "cancel" or enters nothing, user will go back to 
homepage. Otherwise user will be redirected to their target chatroom with room ID and their
name displayed. Empty input will be warned.

The display panel will show top 20 hot chatrooms, sorted by their messages in total.

##Chatroom
The chatroom page will display room ID and user's nickname on the title line. The middle
part of the page displays all the history messages and upcoming messages. The panel is 
automatically scrolled to the bottom. User can enter a new message and click on "Go!". 
Then their message will be immediately sent and display on the pad if sent successfully.
Empty input will be warned.

##Style
Styles of Chatrooms are based on Bootstrap V3.