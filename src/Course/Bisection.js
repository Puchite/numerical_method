import React from 'react'



let a = 1.5
let b = 2.0
let e = 0.0000001

function Bisection() {
    return (
        <div className='bisection'>
            <h2>Bisection</h2>
            <h3>x^4-13 = 0</h3>
            <p>ans = {calBisection(a,b)}</p>
        
        </div>
    )
}

function calFunction(x){
    return (Math.pow(x,4))-13
}

function calBisection(xl, xr){

    let xm = (xl+xr)/2
    let c = 1
    let temp = 0
    while(c>e)
    {
        let fxm = calFunction(xm)
        let fxl = calFunction(xl)
        let fxr = calFunction(xr)

        if (fxm*fxr > 0){
            temp = xr
            xr = xm
        }
        else{
            temp = xl
            xl = xm
        }

        c = (xm-temp)/xm
        c = Math.abs(c)
        console.log(c)
        xm = (xl+xr)/2
        
    }

    console.log(xm)
    return xm

}


export default Bisection
