const endPoint = "https://prod-in2.100ms.live/hmsapi/virtual.app.100ms.live/";


export default async function GetToken( role) {
    const response = await fetch(`${endPoint}api/token`, {
      method: 'POST',
      body: JSON.stringify({
        user_id: '5fc62c5872909435454572bf9995e1', 
        role: role, 
        room_id: "628b59af2630221c75a2cc69"
      }),
    });
  
    const { token } = await response.json();
  
    return token;
  }