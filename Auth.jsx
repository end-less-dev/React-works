import axios from 'axios'
import { useEffect } from 'react'
const Auth = ()=>{

    useEffect(()=>{
        const headers = {Key:"token",Value:123456};
        axios.get("http://localhost:8080/api/user/userLists",{headers})
        .then((response)=>{
            console.log(response.data)
        })
    })


}
export default Auth;