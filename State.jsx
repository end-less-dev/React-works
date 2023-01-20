import { useState } from "react"
const State = ()=>{
    let [data, setData]=useState("Hungry")
    let hello = ()=>{
        setData("My stomach is full")
    }
    return(
        <div>
            {data}
            <button onClick={hello}>Food</button>
        </div>
    )
}
export default State