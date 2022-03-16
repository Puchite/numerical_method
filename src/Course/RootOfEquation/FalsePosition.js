import React from 'react'
import { MathComponent } from 'mathjax-react'
import functionPlot from 'function-plot'

let a = 0.02
let b = 0.03
let e = 0.000001


function calFunction(x){
    return ((43*x)-1)
}

function calFalsePosition(xl, xr){

    let x1 = 0
    let c = 1
    let temp = 0

    while(c>e){

        let fx1 = calFunction(x1)
        let fxl = calFunction(xl)
        let fxr = calFunction(xr)

        x1 = ((xl*fxr)-(xr*fxl))/(fxr-fxl)

        if (fx1*fxr > 0){
            temp = xr
            xr = x1
        }
        else{
            temp = xl
            xl = x1
        }

        c = (x1-temp)/x1
        c = Math.abs(c) 
        console.log(c)      
        
    }

    return x1

}

function FalsePosition() {

    return (

        <div className='entire_page'>
            
            <div className='super_header'>

                <h1>
                    This is False Position Method
                </h1>

                <h3> Problem : <MathComponent tex={String.raw`43x-1`}/> Left : 0.02 Right : 0.03 </h3>
                <br/>
                
                <p>answer is {calFalsePosition(a,b).toFixed(6)}</p>
                
                
                                
                
            </div>
            
      


        </div>
    )

}

export default FalsePosition
