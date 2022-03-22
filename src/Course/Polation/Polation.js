import React, { useEffect, useState, useRef } from 'react'
import functionPlot from 'function-plot'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios'
import * as math from 'mathjs'
import Desmos from 'desmos'
import { Chart } from 'chart.js'
import  { MathJax, MathJaxContext } from 'better-react-mathjax'
import { DataGrid } from '@mui/x-data-grid';

import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

// import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from "chart.js"
// import { Bar, Line } from "react-chartjs-2"; 


let e = Math.E
let epsilon = 0.000001
const baseUrl = 'http://localhost:3001/root-equation/'
let elt = document.getElementById('elt')
let calculator = Desmos.GraphingCalculator(elt);  

// ChartJS.register(
//     LineElement,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     Title,
//     Tooltip,
//     Legend
// );

const methodOption = [
    { value: "newtonDivide", label: "Newton's Divided-Differences"},
]


const data = {
    labels: ['A','B','C'],
    datasets: [{ 
        data: [1, 2, 3],
        label: "Error",
        borderColor: "#3e95cd",
        fill: false
      }
    ]
}

const options = {
    title: {
      display: true,
      text: 'World population per region (in millions)'
    }
}

const columnsTable = [
    { 
        field: 'id',
        headerName: 'ID', 
        width: 70,
        type: 'number',
        editable: false,
        sortable: false,
    },
    {
        field: 'x',
        headerName: 'X',
        width: 150,
        type: 'number',
        editable: false,
        sortable: false,
    },
    {
        field: 'y',
        headerName: 'Y',
        width: 150,
        type: 'number',
        editable: false,
        sortable: false,
    }
  ];


function Polation(){
    
    const [ left, setLeft ] = useState('-10')
    const [ right, setRight ] = useState('10')
    const [ x, setX ] = useState('')
    const [ y, setY ] = useState('')
    const [ rowTable, setRowTable ] = useState([
        {
            id: '',
            x: '',
            y: ''
        }
    ])

    const [ equation, setEquation ] = useState('')
    const [ answer, setAnswer ] = useState(0)
    const [ dataError, setDataError ] = useState([])
    const [ chartData, setChartData ] = useState([])
    const [ chartAnswer, setChartAnswer] = useState([])
    const [ chartOptions, setChartOptions ] = useState([{}])
    const [ roundset, setRoundset ] = useState([{}])
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
    const chartDataRef = useRef(chartData)
    const rowTableRef = useRef(rowTable)
    const xRef = useRef(x)
    const yRef = useRef(y)
    
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
            chartDataRef.current = chartData
            rowTableRef.current = rowTable
            xRef.current = x
            yRef.current = y
        }

        

    }, [equation, problem, chartData, rowTable]);


    const getData = async () => {
        
        await axios.get('http://localhost:3001/polation')
                                   .then((res) =>{
                                        console.log('fetch success data is', res.data)
                                        const response = res.data
                                        setRes(response)
                                        
                                    }, (error) => {
                                        console.log(error)})
        
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
            
            case "newtonDivide":         
                setapiProblem(res.newtonDivide)
                break
            
            case '1':
                setapiProblem(res.falsePosition)
                break
            
            case '2':
                setapiProblem(res.onePoint)
                break

            case '3':
                setapiProblem(res.newtonRaphson)
                break

            default:
                console.log('No Course Found')
        }
    
    }

    const handleProblem = (e) => {

        setProblem(e.target.value)
        setX(apiProblem[e.target.value-1].x)
        setY(apiProblem[e.target.value-1].y)
        console.log(apiProblem[e.target.value-1].x)
        let obj = []
        for(let index = 0; index < apiProblem[e.target.value-1].x.length;  index++)
        {
            console.log("X",apiProblem[e.target.value-1].x[index])
            console.log("Y",apiProblem[e.target.value-1].y[index])
            obj.push({id:index, x:apiProblem[e.target.value-1].x[index], y:apiProblem[e.target.value-1].y[index]})
        }

        setRowTable(obj)
        console.log(rowTable)
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

    const handleSubmit = (e) => {

        e.preventDefault();

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
                calculator.setExpression({ id: 'graph2', latex: point})

                console.log(dataError)
    
            } catch (error) {
                console.log("update Plot Error")
            }
        }      
        

    }

    function callMethod(method)
    {
        switch(method)
        {
            case 'newtonDivide':
                calnewtonDivide(x, y)
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
            let eq = math.parse(equation)
            return eq.evaluate({x:xq})
        } catch (error) {
            console.log(error)
            console.log("Equation Error")
        }
        
    }

    function calnewtonDivide(x, y){
        
        function recursiveC(x, y, c){

            if(c === 0)
            {
                return c
            }
            else if(c > 0)
            {
                return recursiveC(x, y, c-1)
            }
            else
            {

            }
        }
    }

    function calBisection(equation, xl, xr){

        xl = parseFloat(xl)
        xr = parseFloat(xr)
        let dataError = []
        let dataAnswer = []
        let xm = ((xl+xr)/2) 
        let c = 1
        let temp = 0
        let fxm = 0
        let fxr = 0
        let round = 1

        while(c>epsilon){
            
            console.log("Iteration: ",round)
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

            console.log("Error :" ,c)
            if(!isFinite(c) || isNaN(c))
            {
                console.log("C is inf or NaN")
                dataError.push({value:1})    
            }
            else
            {
                dataError.push({value:c})
            }

            xm = (xl+xr)/2
            dataAnswer.push({answer:xm})

            round = round+1
            console.log("--------------------------")
        }
        
        console.log("DataError: ",dataError)
        setChartData(dataError)
        setChartAnswer(dataAnswer)
        return xm
    
    }
    
    function calFalsePosition(equation, xl, xr){

        let dataError = []
        let dataAnswer = []
        let x1 = 0
        let c = 1
        let temp = 0
    
        while(c>epsilon){
    
            let fx1 = calFunction(equation, x1)
            let fxl = calFunction(equation, xl)
            let fxr = calFunction(equation, xr)
    
            x1 = ((xl*fxr)-(xr*fxl))/(fxr-fxl)
            dataAnswer.push({answer:x1})

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
            
            if(!isFinite(c) || isNaN(c))
            {
                console.log("C is inf or NaN")
                dataError.push({value:1})    
            }
            else
            {
                dataError.push({value:c})
            }
        }
        
        console.log("DataError: ",dataError)
        setChartData(dataError)
        setChartAnswer(dataAnswer)

        return x1
    
    }

    function calOnePoint(equation, start){

        let dataError = []
        let dataAnswer = []
        let x_old = parseFloat(start)
        let x_new = 0
        let c = 1
        while(c>epsilon){  
          
            x_new = calFunction(equation,x_old)

            dataAnswer.push({answer:x_new})

            c = Math.abs((x_new-x_old)/x_new)

            if(!isFinite(c) || isNaN(c))
            {
                console.log("C is inf or NaN")
                dataError.push({value:1})    
            }
            else
            {
                dataError.push({value:c})
            }

            if(c === Infinity){

              console.log('Infinity')
              setChartData(dataError)
              setChartAnswer(dataAnswer)

              return x_old
            }
      
            else{
              x_old = x_new
            }
            
        }
        
        console.log("DataError: ",dataError)
        setChartData(dataError)
        setChartAnswer(dataAnswer)

        return x_new
      
    }

    function calNewton(equation, start){

        let dataError = []
        let dataAnswer = []
        let x_temp = 0
        let x_old = parseFloat(start)
        let x_new = 0
        let c = 1
      
        while(c>epsilon){  
      
            x_temp = -calFunction(equation, x_old)/calFunction(math.derivative(equation, 'x').toString(), x_old)
            console.log("Delta X: "+x_temp)
            x_new = x_old + x_temp
            console.log("X_new: "+x_new)
            dataAnswer.push({answer:x_new})

            c = Math.abs((x_new-x_old)/x_new)
            console.log("Error: "+c)

            if(!isFinite(c) || isNaN(c))
            {
                console.log("C is inf or NaN")
                dataError.push({value:1})    
            }
            else
            {
                dataError.push({value:c})
            }

            if(c === Infinity || isNaN(c)){

                setDataError(dataError)
                setChartAnswer(dataAnswer)
                return x_old
            }      
            else{
              x_old = x_new
            }
            
        }
        
        setChartData(dataError)
        console.log("***Data Error is: ", dataError)
        setChartAnswer(dataAnswer)

        return x_new
      
    }

    const showProblem = (matrix) => {
        try {
          return (
                <MathJax dynamic>
                  {"\\(" +
                    math.parse(matrix.toString().replace(/\r/g, "")).toTex({
                      parenthesis: "keep",
                      implicit: "show",
                    }) +
                  "\\)"}
                </MathJax>
          );
        } catch (e) {
          return <MathJax dynamic>{e.toString}</MathJax>;
        }
    };

    return (
            
        <div className='entire_page'>
            
            <div className='super_header'>

                <h1>
                    This is Polation Course 
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
                    {apiProblem ? apiProblem.map(item => <option key={item.id} >{item.id}</option>):null}
                    
                </select>                                                            
                
            </div>

            <br/>
            {/* <div> Problem is : {problem} </div> */}

            <form className='form' onSubmit={handleSubmit}>

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

                        <input type="submit" value="Submit" />

                    </div>
                
                }

                
            </form>

            <br/>

            <div className='content' style={{textAlign: 'center'}}>

                <div className='problem-div'>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={rowTable}
                            columns={columnsTable}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                        />
                    </div>
                </div>

                <div className='answer-div'>
                    <h2> answer is  {answer} </h2>
                </div>
                
            </div>                        
            
            <div className='chart'>
            
                
                <div className='error-chart'>
                    <label>Error</label>

                    <LineChart
                        width={500}
                        height={500}                
                        data={chartData}
                        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    >

                        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                        <XAxis />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#F1230A" strokeWidth={5} />
                    </LineChart>

                </div>

                
                <div className='answer-chart'>
                    <label>Answer</label>
                    <LineChart
                        width={500}
                        height={500}                
                        data={chartAnswer}
                        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    >
                        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                        <XAxis />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="answer" stroke="#6EF50B" strokeWidth={5} />
                    </LineChart>

                </div>
            
            </div>

            {/* <SyntaxHighlighter className="code" language="javascript" style={xonokai} showLineNumbers='true' >
                {codeString+codeString2}
            </SyntaxHighlighter>         */}            

           
        </div>     
        
    )
}

export default Polation;