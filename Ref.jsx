const { useRef } = require("react")

const Ref = ()=>{
    let demoref = useRef();
    let clr = ()=>{
        demoref.current.style.color = "red";
    }
    return(
        <div>
            <h1 ref={demoref}>Heading ref</h1>
            <button onClick={clr}>Click</button>
        </div>
    )
}
export default Ref;