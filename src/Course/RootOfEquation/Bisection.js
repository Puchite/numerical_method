import React, { useEffect, useState, useRef } from 'react'
import './Bisection.css'
import functionPlot from 'function-plot'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios'
import { parse, derivative, evaluate } from 'mathjs';
import Desmos from 'desmos'
import { Chart } from 'chart.js'

let e = Math.E
let epsilon = 0.000001
const baseUrl = 'http://localhost:3001/root-equation/'
let elt = document.getElementById('elt')
let calculator = Desmos.GraphingCalculator(elt);  

const methodOption = [
    { value: "bisection", label: "Bisection Method"},
    { value: "falsePosition", label: "False Position Method" },
    { value: "onePoint", label: "One Point Method" },
    { value: "newtonRaphson", label: "Newton Raphson Method"},
]

    // functionPlot({

            //     target: '#plot',
            //     width: 600,
            //     height: 500,            
            //     annotations:[{
            //         x: left,
            //         text: 'Left = '+ left
            //     },{
            //         x: right,
            //         text: 'Right = '+ right
            //     }],
            //     yAxis: {
            //         label: 'Y axis',
            //         domain: [-5, 5]
            //     },
            //     xAxis: {
            //         label: 'X axis',
            //         domain: [-5, 5]
            //     },
            //     data: [
            //         {
            //             fn: problem.replace(/e/g,'2.71828182846').replace(/\(/g,'').replace(/\)/g,''), color:'black'
            //         },
            //         {
            //             points: [
            //                 [5, 0]
            //             ],
            //             color: 'red',
            //             fnType: 'points',
            //             graphType: 'scatter'
            //         }],

            //     disableZoom: false,
            //     grid: true
        
    // })

function Bisection(){
    // const [ bound, setBound ] = useState({left:'0',right:'0'})
    const [ left, setLeft ] = useState('-100')
    const [ right, setRight ] = useState('100')
    const [ equation, setEquation ] = useState('')
    const [ answer, setAnswer ] = useState(0)
    const [ apiProblem, setapiProblem ] = useState('')
    const [ problem, setProblem] = useState('Custom')
    const [ disableInput, setDisableinput ] = useState(true)
    const [ customInput, setCustominput ] = useState(false)
    const [ method, setMethod ] = useState('none')
    const [ res, setRes ] = useState([])
    const [ start, setStart ] = useState('')
    const isfirstRender = useRef(true)
    const equationRef = useRef(equation)
    const problemRef = useRef(problem)
    let tempAnswer;

    useEffect(() => {
    
        if(isfirstRender.current)
        {
            getData()                    
            elt = document.getElementById('elt')   
            calculator = Desmos.GraphingCalculator(elt);      
            calculator.setExpression({ id: 'graph2', latex: 0})
            isfirstRender.current = false
            console.log("*This is First Render")
        }
        else
        {
            
            equationRef.current = equation
            problemRef.current = problem 
        }

    }, [equation, problem]);


    const getData = async () => {
        
        await axios.get('http://localhost:3001/root-equation')
                                   .then((res) =>{
                                        console.log('fetch success data is', res.data)
                                        const response = res.data
                                        setRes(response)
                                        
                                    }, (error) => {
                                        console.log(error)})
        
    }

    const handleLeftInput = (e) => {

        if(e.target.value === '')
        {
            setLeft('-100')
        }
        else
        {
            setLeft(e.target.value)
        }
        
    }

    const handleRightInput = (e) => {

        if(e.target.value === '')
        {
            setRight('100')
        }
        else
        {
            setRight(e.target.value)
        }
        
    }

    const handleStartInput = (e) =>{
        setStart(e.target.value)
    }

    const handleEquationInput = (e) => {
        setEquation(e.target.value)
        console.log(equation)
    }

    const handleMethod = (e) => {

        console.log(e.target.value)
        if(e.target.value === 'none')
        {
            setMethod('none')
        }
        else
        {
            setMethod(e.target.value)
            setProblem('Custom')
        }

        switch (e.target.value)
        {
            
            case "bisection":         
                setapiProblem(res.bisection)
                break
            
            case 'falsePosition':
                setapiProblem(res.falsePosition)
                break
            
            case 'onePoint':
                console.log('onePoint')
                setapiProblem(res.onePoint)
                break

            case 'newtonRaphson':
                console.log('newtonRaphson')
                setapiProblem(res.newtonRaphson)
                break

            default:
                console.log('No Method Found')
        }

        
    }

    const handleProblem = (e) => {


        setProblem(e.target.value)
       
        if(e.target.value === 'Custom')
        {
            setDisableinput(false)
            setCustominput(true)
        }
        else
        {
            setDisableinput(true)
            setCustominput(false)
        }
        
    }  

    const handleSubmit = () => {

        if(customInput === true)
        {
            setProblem(equation)     
            callMethodCustom(method)          
            
            try {   
                console.log('equation:'+equation+' answer: '+answer)
                console.log("tempAnswer: "+tempAnswer)
                let point = "("+tempAnswer+",0)"
                
                calculator.setExpression({ id: 'graph1', latex: equation.replace(/\(/g,'').replace(/\)/g,'')})
                calculator.setExpression({ id: 'graph2', latex: point});
    
            } catch (error) {
                console.log("update Plot Error")
            }
            
        }
        else
        {
            callMethod(method)

            try {   
                console.log('equation:'+problem+' answer: '+answer)
                let point = "("+tempAnswer.toFixed(6)+",0)"
              
                calculator.setExpression({ id: 'graph1', latex: problem.replace(/\(/g,'').replace(/\)/g,'')})
                calculator.setExpression({ id: 'graph2', latex: point});
    
            } catch (error) {
                console.log("update Plot Error")
            }
        }      
        
        // try {   
        //     console.log('equation:'+problem+' answer: '+answer)
        //     let point = "("+tempAnswer+",0)"
          
        //     calculator.setExpression({ id: 'graph1', latex: problem.replace(/\(/g,'').replace(/\)/g,'')})
        //     calculator.setExpression({ id: 'graph2', latex: point});

        // } catch (error) {
        //     console.log("update Plot Error")
        // }
        
    }

    function callMethod(method)
    {
        switch(method)
        {
            case 'bisection':
                console.log('bisection')
                console.log('equation: '+problem+' left: '+left+' right:'+right)
                // setAnswer(calBisection(problem, left, right))
                tempAnswer = calBisection(problem, left, right)
                console.log("Temp answer:"+tempAnswer)
                setAnswer(tempAnswer)
                break

            case 'falsePosition':
                console.log('falsePosition')
                console.log('equation: '+problem+' left: '+left+' right: '+right)
                tempAnswer = calFalsePosition(problem, left, right)
                console.log("Temp answer:"+tempAnswer)
                setAnswer(tempAnswer)
                break

            case 'onePoint':
                console.log('onePoint')
                console.log('equation: '+problem+' start: '+start)
                tempAnswer = calOnePoint(problem, start)
                console.log("Temp answer:"+tempAnswer)
                setAnswer(tempAnswer)
                break
            
            case 'newtonRaphson':
                console.log('newtonRaphson')
                console.log('equation: '+problem+' start: '+start)
                tempAnswer = calNewton(problem, start)
                console.log("Temp answer:"+tempAnswer)
                setAnswer(tempAnswer)
                break

            default:
                console.log('No Method Found')
                
        }     
    }

    function callMethodCustom(method)
    {
        switch(method)
        {
            case 'bisection':
                console.log('bisection')
                console.log('equation: '+equation+' left: '+left+' right:'+right)
                // setAnswer(calBisection(problem, left, right))
                tempAnswer = calBisection(equation, left, right)
                console.log("Temp answer:"+tempAnswer)
                setAnswer(tempAnswer)
                break

            case 'falsePosition':
                console.log('falsePosition')
                console.log('equation: '+equation+' left: '+left+' right: '+right)
                tempAnswer = calFalsePosition(equation, left, right)
                console.log("Temp answer:"+tempAnswer)
                setAnswer(tempAnswer)
                break

            case 'onePoint':
                console.log('onePoint')
                console.log('equation: '+equation+' start: '+start)
                tempAnswer = calOnePoint(equation, start)
                console.log("Temp answer:"+tempAnswer)
                setAnswer(tempAnswer)
                break
            
            case 'newtonRaphson':
                console.log('newtonRaphson')
                console.log('equation: '+equation+' start: '+start)
                tempAnswer = calNewton(equation, start)
                console.log("Temp answer:"+tempAnswer)
                setAnswer(tempAnswer)
                break

            default:
                console.log('No Method Found')
                
        }     
    }

    function calFunction(equation, xq){
        
        try {
            let eq = parse(equation)
            return eq.evaluate({x:xq})
        } catch (error) {
            console.log(error)
            console.log("Equation Error")
        }
        
    }

    function calBisection(equation, xl, xr){
        xl = parseFloat(xl)
        xr = parseFloat(xr)
        let xm = ((xl+xr)/2) 
        let c = 1
        let temp = 0
        let fxm = 0
        let fxr = 0
        
        while(c>epsilon){
            
            fxm = calFunction(equation, xm)
            fxr = calFunction(equation, xr)
    
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

            xm = (xl+xr)/2
            
        }
    
        return xm
    
    }
    
    function calFalsePosition(equation, xl, xr){

        let x1 = 0
        let c = 1
        let temp = 0
    
        while(c>epsilon){
    
            let fx1 = calFunction(equation, x1)
            let fxl = calFunction(equation, xl)
            let fxr = calFunction(equation, xr)
    
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
            
        }
    
        return x1
    
    }

    function calOnePoint(equation, start){

        let x_old = parseFloat(start)
        let x_new = 0
        let c = 1
        while(c>epsilon){  
          
            x_new = calFunction(equation,x_old)
            c = Math.abs((x_new-x_old)/x_new)

            if(c === Infinity){
              console.log('Infinity')
              return x_old
            }
      
            else{
              x_old = x_new
            }
            
        }
      
        return x_new
      
    }

    function calNewton(equation, start){

        let x_temp = 0
        let x_old = parseFloat(start)
        let x_new = 0
        let c = 1
      
        while(c>epsilon){  
      
            x_temp = -calFunction(equation, x_old)/calFunction(derivative(equation, 'x').toString(), x_old)
            console.log("Delta X: "+x_temp)
            x_new = x_old + x_temp
            console.log("X_new: "+x_new)
            c = Math.abs((x_new-x_old)/x_new)
            console.log("Error: "+c)

            if(c === Infinity || isNaN(c)){
              return x_old
            }
      
            else{
              x_old = x_new
            }
            
        }
      
        return x_new
      
    }

    return (
            
        <div className='entire_page'>
            
            <div className='super_header'>
                <h1>
                    This is Root Equation 
                </h1>

                <label>Method:</label>
                <select onChange={handleMethod}>
                    <option value='none' >Select Method for Solving Equation</option>
                    {/* {methodOption.map(options => <option key={options.value}>{options.label}</option>)} */}
                    {methodOption.map((options) => <option key={options.value} value={options.value}>{options.label}</option>)}

                </select>  

                <br/>

                <label>Problem:</label>
                <select onChange={handleProblem}>
                    <option value="none" >Select Equation</option>
                    <option value="Custom">Custom</option>
                    {apiProblem ? apiProblem.map(item => <option key={item.problem} >{item.problem}</option>):null}
                    
                </select>                                                            

                {/* <h3> Problem : <MathComponent tex={String(problem)}/></h3> */}
                {/* <p> answer is {calBisection(a,b).toFixed(6)} </p> */}
                
            </div>

            <br/>
            {/* <div> Problem is : {problem} </div> */}

            <form className='form' onSubmit={handleSubmit}>

                {/* <label>
                    Function:
                    <input 
                        type="text" 
                        // value={equation} 
                        onChange={handleEquationInput} 
                        disabled={disableInput} 
                        placeholder='equation'
                    />
                </label> */}

                {
                    method !== 'onePoint' & method !== 'newtonRaphson'  & method !== 'none' &&
                                        
                    <div className='input-div'>
                        
                        <div className='equation-input-div'>
                            <label>Equation:</label>
                            <input 
                                type="text" 
                                onChange={handleEquationInput} 
                                disabled={disableInput} 
                                placeholder='equation'
                            />
                        </div>

                        <div className='left-input-box'>
                            <label>Left:</label>
                            <input 
                                type="text" 
                                onChange={handleLeftInput}
                                placeholder='Left'    
                            />                            
                        </div>
                        
                        <div className='right-input-box'>                        
                            <label>Right:</label> 
                            <input 
                                type="text"   
                                onChange={handleRightInput}  
                                placeholder="Right"
                            />
                        </div>

                        <input type="submit" value="Submit" />

                    </div>
                
                }
                {
                    method !== 'bisection' & method !== 'falsePosition' & method !== 'none' &&

                    <div className='input-div'>

                        <div className='equation-input-div'>
                            <label>Equation:</label>
                            <input 
                                type="text" 
                                onChange={handleEquationInput} 
                                disabled={disableInput} 
                                placeholder='equation'
                            />
                        </div>
                        
                        <div className='start-input-box'> 
                            <label>Start:</label>
                            <input 
                                type="text" 
                                // value={left} 
                                onChange={handleStartInput}
                                // disabled={disableInput} 
                                placeholder='Start'    
                            />
                        </div>

                        <input type="submit" value="Submit" />

                    </div>
                
                }
                
                {/* <label>
                    Left:
                    <input 
                        type="text" 
                        // value={left} 
                        onChange={handleLeftInput}
                        // disabled={disableInput} 
                        placeholder='Left'    
                    />
                </label>

                <label>
                    Right:
                    <input 
                        type="text" 
                        // value={right}  
                        onChange={handleRightInput}
                        // disabled={disableInput}  
                        placeholder="Right"
                    />
                </label> */}
                    
            </form>

            <br/>
            <div className='content' style={{textAlign: 'center'}}>
                <div className='problem-div'>
                    <h2> Equation is {problem} </h2>
                </div>
                <div className='answer-div'>
                    <h2> answer is  {answer} </h2>
                </div>
                
            </div>
                        
            <div id='elt' style={{width: '600px', 
                                  height: '400px',
                                  alignItems: 'center',
                                  justifyItems: 'center'}}> 
            </div>
                
            <canvas id="myChart" width="400" height="400"></canvas>
            {/* <SyntaxHighlighter className="code" language="javascript" style={xonokai} showLineNumbers='true' >
                {codeString+codeString2}
            </SyntaxHighlighter>         */}

        </div>     
        
    )
}

export default Bisection
