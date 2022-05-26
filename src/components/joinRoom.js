import React, { useState } from 'react';
import {
    useHMSActions,
    } from "@100mslive/react-sdk";
import GetToken from '../utils/getToken';
import '../App.css';

export default function JoinRoom() {
    const hmsActions = useHMSActions()

    const [name, setName] = useState("Anonymous")
    const [joinStatus, setJoinStatus] = useState("");
    const [role, setRole] = useState('stage');

   

    const handleSelectChange = (e) =>{
        setRole(e.target.value)
    }
    const handleInputChange = (e) =>{

       setName(e.target.value)

    }

    const handleSubmit = () =>{
        setJoinStatus("Please wait! Meeting is preparing") 
        
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
            <div className='status-div'>
            <p className='status'>{joinStatus}</p>

            </div>

    </div>
  )
}



