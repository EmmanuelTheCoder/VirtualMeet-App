


Ever since remote work became the preference for a lot of people, there have been pressing need for platforms where teams can meet over the air to discuss things like: project status, features implementation, needed changes, to name a few. Not just teams or people doing remote jobs. Friends and families also want to be able to talk to each other without having to travel half way across the world to do that. Many platforms like Zoom, Google Meet, Twitch, Agora etc. provides this needed service.

This article will discuss how to build your own Virtual Meet Application that has embedded video, audio and chat features like Google Meet or any of your favorite virtual meet app using [100ms](https://www.100ms.live/docs/javascript/v2/guides/react-quickstart) and React.

## Why should you use 100ms?

[100ms](https://100ms.live) is a cloud-based platform that empowers you to build video and audio conferencing into your application by utilizing their powerful [Rest APIs and SDKs](https://www.100ms.live/docs/javascript/v2/guides/react-quickstart) which enables you to set up fully functional real time communication services within the shortest time possible. This is to say, you don't have to reinvent the wheel by building from the ground up. 

It provides you with a dashboard in order for you to configure your application to your own taste and optimize for best performance.

Here are other React projects you can build with 100ms

- [Building Twitch clone](https://www.100ms.live/blog/twitch-clone-in-react)
- [Building Google meet clone](https://www.100ms.live/blog/google-classroom-clone-react-100ms#important-terms)
- [Building Slack huddle clone](https://www.100ms.live/blog/building-slack-huddle-clone?utm_source=cta&utm_medium=inline&utm_campaign=twtcl&utm_id=blogCTA)
- [Build a Discord stage channel](https://www.100ms.live/blog/build-discord-stage-channel-clone-hms?utm_source=cta&utm_medium=inline&utm_campaign=twtcl&utm_id=blogCTA)

## Basic concept

100ms has some terms that you need to be familiar with before proceeding into this tutorial:

* `Room`: A room is the basic object that 100ms SDKs return on successful connection. This contains references to peers, tracks and everything you need to render a live a/v app.

* `Peer`: A peer is the object returned by 100ms SDKs that contains all information about a user - name, role, video track etc.

* `Track`: A track represents either the audio or video that a peer is publishing.

* `Role`: A role defines who can a peer see/hear, the quality at which they publish their video, whether they have permissions to publish video/screenshare, mute someone, change someone's role.

* `Template`: A template is a collection of roles, room settings, recording and RTMP settings (if used), that are used by the SDK to decide which geography to connect to, which tracks to return to the client, whether to turn on recording when a room is created, etc. Each room is associated with a template.

* `Recording`: Recording is used to save audio/video calls for offline viewing. 100ms supports 2 kinds of recording - SFU recording and Browser recording.

* `RTMP`: RTMP streaming is used to live stream your video conferencing apps to platforms like YouTube, Twitch, Facebook, MUX, etc.

* `Webhooks`: Webhook is an HTTP(S) endpoint used for pushing the notifications to your application. It will be invoked by 100ms servers to notify events of your room.

## Features this tutorial will cover

* Creating a room where peers can join and participate
* Muting and unmuting the video and audio.
* Chat feature
* Leave room/ end call.

## Requirements

To be able to follow along this tutorial you need to have the following:

* A [100ms](100ms.live) account. We will need to create room on the dashboard and retrieve the `room id` to integrate on our app.

* Knowledge of React and JavaScript.

* Nodejs installed on your machine.

* Any code editor you prefer.


## Setting up the project

* Create a React App. to use the create-react-app boiler plate, run `npx create-react-app <appname>`

* Install 100ms React SDK. Run `npm install --save @100mslive/react-sdk`

* Retrieve credentials: Get `token_endpoint` and `room_id` from the developer section of the dashboard.

* Create Roles: Create the viewer and stage roles and determine the permission for peers - audio, video, mute, unmute etc.

At the end of this tutorial, our virtual meet app will look like this:
![finished application](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/31uivui307m2rdjmxsvk.png)

## Creating a 100ms account and retrieving credentials

We cannot build our virtual meet app without first creating a 100ms account.
After signing up, go to the [dashboard](https://dashboard.100ms.live/login) to get your `token_endpoint` and `room_id` which we shall be needing when building our app.

Follow the steps below to create and set up your new app:

* Create a new app inside the dashboard

* Choose a template
![template](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rx6vhmxlo5208t0z6u0r.png)

You can choose any template that best suite your need. You could also "create your own." In this tutorial, Virtual events is the template we selected.

* Create roles: A role defines who a peer sees or hears, the quality at which they publish their video, whether they have permission to publish video/screen share, mute someone, change someone's role.

The virtual app we are building would have the following roles:

* `Stage`: can speak, mute and unmute himself as well as share screen. To create this role, turn on all publish strategies, then turn off all permissions except can end current session of the room and remove all participants.

* `Viewer`: can only listen to the stage. To create this role, turn off all publish strategies.

![stage](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2qpwwnp4gaoel00ib58h.png)

![stage permissions](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9xo3eb11hgodyxcplc6p.png)

![viewer](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yvz70cc8ar1q96kjhguz.png)

![viewer permission](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2srx1gila8vu5pgcod74.png)

* Create room: users joining a call are said to be joining a room.
to create a room, click on `Rooms` on the dashboard then create room.

![room](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/f8vfthex09pcbopv3uqs.png)

Now that we have everything setup, let's proceed to building our app. whooooooa!

## Building our app

The 100ms-react-sdk we installed in our React app previously have two hooks that we need to get familiar with:

* `hmsStore`: this contains the complete state of the room at any given time such as the participant details etc.
* `hmsActions`: this is used to perform any action such as sending a message or joining a room.

Now that we know this, let's get our hands dirty by writing some codes.

Let's start with `getToken.js` in the utils folder of our project

`getToken.js`

```
const endPoint = "<token_endpoint>";
export default async function GetToken(role) {
	const response = await fetch(`${endPoint}api/token`, {
		method: 'POST',
		body: JSON.stringify({
		 user_id: '2234', // a reference user id assigned by you
	         role: role, // stage, viewer 
		 room_id: "<room_id>" // copied from the dashboard
		}),
	});
	const { token } = await response.json();
}
```

Replace `<token_endpoint>` with the `token_endpoint` from the developer menu on your dashboard. Fill in `room_id` to the correct `room_id` as seen on the dashboard.

Oh, wait right there! we almost forgot. Before 100ms can work in our application, we need to go inside our `index.js` file and wrap `<App />` component with `HMSRoomProvider` like this:

```
//...
import {HMSRoomProvider} from '@100mslive/react-sdk'
ReactDOM.render(
  <React.StrictMode>
    <HMSRoomProvider>
      <App />

    </HMSRoomProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


```


Let's create a form where users can fill in their name and select their `role` to join the room.

`joinRoom.js`

```
import React, { useState } from 'react';
import {
    useHMSActions,
    } from "@100mslive/react-sdk";
import GetToken from '../utils/getToken';
import '../App.css';

export default function JoinRoom() {
    const hmsActions = useHMSActions()

    const [name, setName] = useState("")
    const [role, setRole] = useState('stage');

   

    const handleSelectChange = (e) =>{
        setRole(e.target.value)
    }
    const handleInputChange = (e) =>{

       setName(e.target.value)

    }

    const handleSubmit = () =>{
        
        GetToken(role)
        .then(token =>{
            return hmsActions.join({
                userName: name,
                authToken: token
            })
        })
        .catch(err => console.log("token error", err))
        
    }
       

    return (
    <div className='app'>
        <div className='login'>
        <h2>Join Meeting Room</h2>

            <input type="text" placeholder="name"  
            value={name}
            onChange={handleInputChange}
            name="name"
            required
            />
           
            <select onChange={handleSelectChange}>
                <option value="stage">Stage</option>
                <option value="viewer">Viewer</option>
            </select>
            
            <button type='submit' onClick={handleSubmit}> Join</button>

        </div>
   

    </div>
  )
}


```


`handleInputChange` and `handleSelectChange` functions are used to set the `name` and `role` states respectively.

`handleSubmit` function calls the `GetToken` function and uses the callback token gotten to initialize the `hmsAction.join` object which takes in two values - `userName` and `authToken`. These must be provided before a user can join the room.
`handleSubmit` is then bind to the onClick listner inside the JSX button tag.

Once done, you should get this:

![Join room look](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6jcb4cy98bmlznz6bwab.png)
 


When a user joins a room, we want to hide this form and display the room the user joined. To do this, navigate into your `App.js` file and add this codes

```
 
import './App.css';
import {selectIsConnectedToRoom, useHMSStore, useHMSActions} from '@100mslive/react-sdk'
import JoinRoom from './components/joinRoom';
import Conference from './components/conference';
import { useEffect } from 'react';


function App() {
  const isConnected = useHMSStore(selectIsConnectedToRoom)
  const hmsActions = useHMSActions()

  useEffect(() =>{
    window.onunload = () => {
      if(isConnected) hmsActions.leave()
    }
  }, [hmsActions, isConnected])

  return (
    <div className="App">
      {
        isConnected ? <Conference /> : <JoinRoom />
      }
    </div>
  );
}

export default App;


```


`const isConnected = useHMSStore(selectIsConnectedToRoom)` helps us check if the user is connect to the room. `<Conference />` component is displayed if the user is connected to the room, if otherwise, the `<JoinRoom  />` component is displayed.

One other interesting thing that we added inside the `App.js` file is hmsActions.leave() inside the useEffect hook. This is to ensure the user leaves the room whenever browser refresh or tab close is triggered. If we don't do this, there would be a few seconds lag if the user ever suddenly refreshes [or close] their tab during a meeting - this is because 100ms would think of it has a network issue and tries to re-establish a connection.

After a user has successfully joined a room, we need to display the video which will be inside the `conference.js` file.

```
import React from 'react'
import VideoTile from './videoTile'
import {
    useHMSStore, 
    selectPeers
    
} from "@100mslive/react-sdk"


export default function Conference() {
    const peers = useHMSStore(selectPeers)
  
  return (
    <div>
        {peers.map(peer =>(
                <VideoTile key={peer.id} peer={peer} />
            ))}

            
    </div>
  )
}

```
The connected `peers` are mapped to the `<VideoTile />` component.

### Now let's go into the `videoTile` file to add a video tag and also configure our video.

```
const VideoTile = () => {

 const videoRef = useRef(null)
    const hmsActions = useHMSActions();

    const videoTrack = useHMSStore(selectCameraStreamByPeerID(peer.id))
    useEffect(() =>{
        if(videoRef.current && videoTrack){
            if(videoTrack.enabled){
                hmsActions.attachVideo(videoTrack.id, videoRef.current)
            }
            else{
                hmsActions.detachVideo(videoTrack.id, videoRef.current)
            }
        }
    }, [videoTrack, hmsActions])

 return(
  <div> 
      <video className="center-vid"
        ref={videoRef} autoPlay muted playsInline>

     </video>

  </div>
)
}
```

#### Let's add the toggle functions

```
const audioEnabled = useHMSStore(selectIsLocalAudioEnabled)
 const videoEnabled = useHMSStore(selectIsLocalVideoEnabled)

    const toggleAudio = async () =>{
        await hmsActions.setLocalAudioEnabled(!audioEnabled)
    }
    const toggleVideo = async () =>{
        await hmsActions.setLocalVideoEnabled(!videoEnabled)

    }

```

#### For audio controls

```
  {
     audioEnabled ? (
      <img src={unmuteIcon} alt="mute" />
    ) : (
    
      <img src={muteIcon} alt="unmute" />
    )

  }
```
#### for video controls

```
  {
     videoEnabled? (
      <img src={videoIcon} alt="CloseCamera" />
    ) : (
    
      <img src={unVideoIcon} alt="OpenCamer" />
    )

  }
```

#### To leave a room

```
<button
  onClick={() => {
      hmsActions.endRoom(false, "reason") && hmsActions.leave();
  }}
>
     <img src="https://img.icons8.com/color/24/000000/end- call.png" alt="end call"/>
</button>;
```

#### Adding a chat section

100ms supports chat for every video/audio room you create.

```
//broadcast message:

hmsActions.sendBroadcastMessage('I just joined the call!'); 

```

```
//group message:

hmsActions.sendGroupMessage('Yo people!', ['moderator', 'host']);

```

```
//direct message:

hmsActions.sendDirectMessage('I DM for you alone!', peer.id);


```

For the purpose of the application we are building, we are going to be adding broadcast message only.

`message.js`

```
const Message = () => {
   const broadcastMessages = useHMSStore(selectBroadcastMessages);

   return (
      <div className="message-container">
        <div className="chat-area">

        {broadcastMessages.map(msg =>{
          const {message, senderName} = msg
              
              return(

                <div key={msg.id}>
                    <p> <span>{senderName }:</span> {message}</p>
                </div>
              )
              
          })}
        </div>

      
      <div className="chat" >
        <input 
        placeholder='write chat here' 
        value={chatContent}
        onChange={handleChat}
        >

        </input>
        <button type='submit' onClick={handleChatSubmit}>send</button>
      </div>
    </div>
  )
}

}

```
#### to send the chat:

```
 const handleChatSubmit = () =>{
    hmsActions.sendBroadcastMessage(chatContent)

    setChatContent("")
    }

```

![finished application](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/31uivui307m2rdjmxsvk.png)
 

Yesssss! We are done. Did I hear you say easy and fast? Yeah, you can say that again. Thanks to 100ms for providing us with the fantastic React SDK that we used. Without this, building a Real Time Communication application from scratch would take days, if not weeks, to figure out.

## Conclusion

100ms stands out by providing multiple solutions matching both common and unique use cases, with just a few clicks and hooks. Sign up with 100ms for free 10000 minutes. Yes! 10,000 minutes.

Check out the [demo](https://virtualmeetapp.netlify.app/).
You can get the [source code here](https://github.com/EmmanuelTheCoder/VirtualMeet-App)
























 
 
 


 


 






 


 

















