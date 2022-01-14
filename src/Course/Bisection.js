import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

let a = 1.5
let b = 2.0
let e = 0.0000000001
let codeString = 'function calFunction(x){\n return (Math.pow(x,4))-13\n}'
let codeString2 = "function calBisection(xl, xr){\nlet xm = (xl+xr)/2\nlet c = 1\nlet temp = 0\nwhile(c>e)\n{\n         let fxm = calFunction(xm)\n         let fxl = calFunction(xl)\n         let fxr = calFunction(xr)\n         if (fxm*fxr > 0){\n                             temp = xr\n                             xr = xm\n                       }\n         else{\n                             temp = xl\n                             xl = xm\n                        }\n\t\t\t\tc = (xm-temp)/xm\n\t\t\t\tc = Math.abs(c)\n\t\t\tconsole.log(c)\n\t\t\t\txm = (xl+xr)/2\n\t}\nconsole.log(xm)\nreturn xm\n}"

function Bisection() {
    
    return (
        <div className='bisection'>
            <h2>Bisection</h2>
            <h3>x^4-13 = 0</h3>
            
            <p>ans = {calBisection(a,b).toFixed(6)}</p>
            
            <h4>Code :</h4>
            <SyntaxHighlighter language="javascript" style={darcula} showLineNumbers='true'>
                {codeString}
                {codeString2}
            </SyntaxHighlighter>
            <SyntaxHighlighter language="javascript" style={darcula} showLineNumbers='true'>
                {codeString2}
            </SyntaxHighlighter>

        </div>
    )
}

// function readFile(){
//     var fs = require("fs");
//     var text = fs.readFileSync("./bisectionCode.txt").toString('utf-8');
//     console.log(text)
//     var codeString = text.split("\n")
    
//     return codeString
// }

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
