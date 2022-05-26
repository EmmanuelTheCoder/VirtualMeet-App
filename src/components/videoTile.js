import React, { useEffect, useRef, useState } from 'react'
import Message from './message';
import { 
    useHMSActions,
    useHMSStore,
    selectCameraStreamByPeerID,
    selectIsLocalAudioEnabled,
    selectIsLocalVideoEnabled,
    selectIsConnectedToRoom

} from '@100mslive/react-sdk'

export default function VideoTile({peer}) {

    const isConnected = useHMSStore(selectIsConnectedToRoom)
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

    //

    //mute button icon

    const muteIcon = "https://img.icons8.com/material-rounded/24/000000/mute.png";
    const unmuteIcon = "https://img.icons8.com/external-tal-revivo-bold-tal-revivo/24/000000/external-volume-mute-function-key-on-computer-keyboard-keyboard-bold-tal-revivo.png";
    const videoIcon = "https://img.icons8.com/ios-glyphs/24/000000/video-call.png"
    const unVideoIcon = "https://img.icons8.com/ios-filled/24/000000/no-video--v1.png"

    const [mediaStatus, setMediaStatus] = useState(true);
    const [videoStatus, setVideoStatus] = useState(true)
    const audioEnabled = useHMSStore(selectIsLocalAudioEnabled)
    const videoEnabled = useHMSStore(selectIsLocalVideoEnabled)

    const toggleAudio = async () =>{
        setMediaStatus(!mediaStatus)
        await hmsActions.setLocalAudioEnabled(!audioEnabled)
    }
    const toggleVideo = async () =>{
        setVideoStatus(!videoStatus)
        await hmsActions.setLocalVideoEnabled(!videoEnabled)

    }

    const handleLeaveRoom = () =>{
        if(isConnected) hmsActions.leave()
    }

   
  return (
      <div className="videoTile-div">

        <div className="video-container">
            <div className="cont">
                <video className="center-vid"
                ref={videoRef} autoPlay muted playsInline
                
                >

                </video>

            </div>

            <div className="func-btn">

                <button onClick={toggleVideo}>
                    <img src={videoStatus ? videoIcon : unVideoIcon} alt="video media" />
                </button>
                <button onClick={toggleAudio}>
                    <img src={mediaStatus  ? unmuteIcon : muteIcon} alt="mute"/>

                </button>
                <button onClick={handleLeaveRoom}>
                <img src="https://img.icons8.com/color/24/000000/end-call.png" alt="cut call"/>
                </button>

            </div>
            
        </div>
        <div>
           <Message />
        </div>
      </div>
    )
}
