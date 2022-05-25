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
