import { useState,useEffect } from "react"
import axios from "axios";
const Hrms = ()=>{
    const[content, setContent] = useState([]);
    const[id, setId]=useState("");
    useEffect(()=>{
        axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .then((response)=>{
            console.log(response.data)
            setContent(response.data)
        })
        .catch(()=>alert("Please pass the valid data"))
    },[id])
   let fun = (e)=>{
        setId(e.target.value)
    }
    return(
        <>
            {/* {content.map((x)=>{
                return(
                    <p>{x.id}</p>
                )
            })} */}
            <input type="text" value={id} onChange={fun}/>
            <br />
            {content.title}
        </>
    )
}
export default Hrms;