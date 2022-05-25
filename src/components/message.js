import React, {useState} from 'react'
import {useHMSStore, selectBroadcastMessages, useHMSActions} from '@100mslive/react-sdk'

export default function Message() {

  const [chatContent, setChatContent] = useState("")
  const hmsActions = useHMSActions()

    const handleChat = (e) =>{
        setChatContent(e.target.value)
    }
    const handleChatSubmit = () =>{
        hmsActions.sendBroadcastMessage(chatContent)

        setChatContent("")
    }

    const broadcastMessages = useHMSStore(selectBroadcastMessages)

    return (
      <div className="message-container">
        <h2 style={{textAlign: 'left', color: 'white', marginTop: '-1rem'}}>Live chat</h2>
        <div className="chat-area">

        {broadcastMessages.map(msg =>{
          const {message, senderName} = msg
              
              return(

                <div key={msg.id}>
                    <p style={{color: '#e4e3e3'}}> <span style={{fontStyle: 'italic'}}>{senderName }:</span> {message}</p>
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
