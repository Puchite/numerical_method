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
    { value: "newtonDivide", label: "Newton's Divided-Differences Method"},
    { value: "lagrange", label: "Lagrange Interpolation Method"},
]

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
        // await axios.get('http://localhost:3001/polation')
        await axios.get('https://my-json-server.typicode.com/Puchite/numerical_method_api/polation')
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
            
            case 'lagrange':
                setapiProblem(res.lagrange)
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
                tempAnswer = calnewtonDivide(x, y)
                setAnswer(tempAnswer)
                break

            case 'lagrange':
                calLagrange(x, y)
                break

            case '1':
                break
            
            case '2':
                break

            default:
                console.log('No Method Found')
                
        }     
    }

    function callMethodCustom(method)
    {
        switch(method)
        {
            case '1':
                break

            case '2':
                break

            case '3':
                break
            
            case '4':
                break

            default:
                console.log('No Method Found')
                
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

    function calLagrange(x, y){
        let xx = 250
        let round = x.length
        let l = 0
        console.log("x is: ",x)

        for(let i = 0; i<round; i++)
        {
            let l_top = 1
            let l_divider = 1
            for(let j = 0; j<round; j++)
            {
                if(j!==i)
                {
                    // console.log("x",j," ",x[j],"-",xx)
                    l_top *= (x[j]-xx)
                    // console.log("l_top: ",l_top)
                    l_divider *= (x[j]-x[i])
                    // console.log("x",j," ","-",x[i])
                    // console.log("l_divider: ",l_divider)
                }
            }
            // console.log(l_top,"/",l_divider,"*",y[i])
            l += (l_top/l_divider)*y[i]
            // console.log("l",[i],": ",l)
            // console.log("***************")
        }

        // console.log(l)
        setAnswer(l)
    }

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
                                      
                    <div className='input-div'>
                        
                        <div className='equation-input-div'>
                            <label>X::</label>
                            <input 
                                type="text" 
                                onChange={handleEquationInput} 
                                disabled={disableInput} 
                                placeholder='equation'
                            />
                        </div>

                        <input type="submit" value="Submit" />

                    </div>

            </form>

            <br/>

            <div className='content' style={{textAlign: 'center'}}>

                <div className='problem-div'>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={rowTable}
                            columns={columnsTable}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            checkboxSelection
                            onSelectionModelChange={(newSelection) => {
                                  
                            }}
                        />
                    </div>
                </div>

                <div className='answer-div'>
                    <h2> answer is  {answer} </h2>
                </div>
                
            </div>                        
            
            {/* <div className='chart'>
            
                
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
            
            </div> */}

            {/* <SyntaxHighlighter className="code" language="javascript" style={xonokai} showLineNumbers='true' >
                {codeString+codeString2}
            </SyntaxHighlighter>         */}            

           
        </div>     
        
    )
}

export default Polation;