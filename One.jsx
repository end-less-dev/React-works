//import style from './one.module.css';
const One =(props)=>{
    const cars = ["Audi","BMW","RR"];

    return(
        <>
            {cars.map((x)=>{
                return(
                    <h1>{x}</h1>
                )
            })}
        </>
    )
}
export default One;