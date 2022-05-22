import React, { useEffect, useState, useRef } from 'react'
import functionPlot from 'function-plot'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios'
import * as math from 'mathjs'
import Desmos from 'desmos'
import { Chart } from 'chart.js'
import { MathJax, MathJaxContext } from 'better-react-mathjax'
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
import { TextField } from '@mui/material';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const methodOption = [
    { value: "linear", label: "Linear Regression" },
    { value: "polynomial", label: "Polynomial Regression" },
    { value: "multiple", label: "Multiple Regression" },
]

let token;
const login = async () => {
    await axios.post('http://localhost:3001/login', {
        email: "s6204062616316@email.kmutnb.ac.th",
        password: "0859150757"
    }).then((res) => {
        token = res.data
        console.log("Token is ", token)
    })
}

function LinearRegression() {
    const [left, setLeft] = useState('-10')
    const [right, setRight] = useState('10')
    const [x, setX] = useState('')
    const [xCustom, setXCustom] = useState('')
    const [yCustom, setYCustom] = useState('')
    const [y, setY] = useState('')
    const [numberOfX, setNumberOfX] = useState(0)
    const [findX, setfindX] = useState(0)
    const [selection, setSelection] = useState([])
    const [rowTable, setRowTable] = useState([
        {
            id: '',
            x: '',
            y: ''
        }
    ]);


    const [equation, setEquation] = useState('')
    const [answer, setAnswer] = useState(0)
    const [dataError, setDataError] = useState([])
    const [chartData, setChartData] = useState([])
    const [chartAnswer, setChartAnswer] = useState([])
    const [chartOptions, setChartOptions] = useState([{}])
    const [roundset, setRoundset] = useState([{}])
    const [apiProblem, setapiProblem] = useState('')
    const [problem, setProblem] = useState('Custom')
    const [disableInput, setDisableinput] = useState(true)
    const [customInput, setCustominput] = useState(false)
    const [method, setMethod] = useState('none')
    const [res, setRes] = useState([])
    const [start, setStart] = useState('')
    const isfirstRender = useRef(true)
    const equationRef = useRef(equation)
    const problemRef = useRef(problem)
    const chartDataRef = useRef(chartData)
    const rowTableRef = useRef(rowTable)
    const xRef = useRef(x)
    const yRef = useRef(y)
    const findXRef = useRef(findX)

    useEffect(() => {

        if (isfirstRender.current) {
            login();
            getData();
        }
        else {
            equationRef.current = equation
            problemRef.current = problem
            chartDataRef.current = chartData
        }

    }, [equation, problem, chartData, chartAnswer])


    const getData = async () => {
        // await axios.get('http://localhost:3001/root-equation')
        // await axios.get('https://my-json-server.typicode.com/Puchite/numerical_method_api/root-equation')
        //     .then((res) => {
        //         console.log('fetch success data is', res.data)
        //         const response = res.data
        //         setRes(response)

        //     }, (error) => {
        //         console.log(error)
        //     })

        console.log("ACCESS TOKEN ", token)
        await axios.get('http://localhost:3001/linearRegression', {
            headers: {
                "Authorization": `Bearer ${token.accessToken}`
            }
        }).then((res) => {
            const response = res.data
            setRes(response)
        })
    }

    const handleMethod = (e) => {

        console.log(e.target.value)
        if (e.target.value === 'none') {
            setMethod('none')
        }
        else {
            setMethod(e.target.value)
            setProblem('')
        }

        switch (e.target.value) {

            case "linear":
                setapiProblem(res.linear)
                console.log(apiProblem)
                break

            case 'polynomial':
                setapiProblem(res.polynomial)
                break

            case 'multiple':
                setapiProblem(res.multiple)
                break

            default:
                console.log('No Method Found')
        }

    }

    const handleProblem = (e) => {

        setProblem(e.target.value)

        if (e.target.value === 'Custom') {
            setDisableinput(false)
            setCustominput(true)
        }
        else {
            setDisableinput(true)
            setCustominput(false)
        }

    }

    const showProblem = (eq) => {
        try {
            return (
                <MathJax dynamic>
                    {"\\(" +
                        math.parse(eq.toString().replace(/\r/g, "")).toTex({
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
                    This is Linear  Regression
                </h1>

                {/* <label>Method:</label>
    <select onChange={handleMethod}>
        <option value='none' >Select Method for Solving Equation</option>
        {methodOption.map(options => <option key={options.value}>{options.label}</option>)}
        {methodOption.map((options) => <option key={options.value} value={options.value}>{options.label}</option>)}

    </select>   */}
                <div className='select-method-div'>
                    <div className='select-method'>
                        <FormControl sx={{ m: 1, minWidth: 500 }}>
                            <InputLabel id="method-select-label"> Method </InputLabel>
                            <Select
                                // defaultValue={null}
                                labelId="select-method"
                                id="method-select"
                                value={method}
                                label="method"
                                onChange={handleMethod}
                            >
                                {methodOption.map((options) =>

                                    <MenuItem value={options.value}>{options.label}</MenuItem>)}

                            </Select>
                        </FormControl>
                    </div>

                </div>

                <br />
                {/* 
    <label>Problem:</label>
    <select onChange={handleProblem}>
        <option value="none" >Select Equation</option>
        <option value="Custom">Custom</option>
        {apiProblem ? apiProblem.map(item => <option key={item.id} >{item.id}</option>) : null}

    </select> */}

                <div className='select-problem-div'>                    
                    <div className='select-problem'>
                        <FormControl sx={{ m: 1, minWidth: 500 }}>
                            <InputLabel id="problem-select-label"> Problem </InputLabel>
                            <Select
                                // defaultValue={null}
                                labelId="select-problem"
                                id="problem-select"
                                value={problem}
                                label="problem"
                                onChange={handleProblem}
                            >                                
                                <MenuItem value='Custom'> Custom </MenuItem>
                                {apiProblem ? apiProblem.map(item =>
                                    <MenuItem value={item.id}>                                        
                                        {
                                            ((method === 'linear') || (method === 'polynomial')) && (
                                                <MathJaxContext>x:{showProblem(JSON.stringify(item.x))} y:{showProblem(JSON.stringify(item.fx))}</MathJaxContext>
                                            )
                                        }
                                        {
                                            ((method === 'multiple')) && (
                                                <MathJaxContext> x1:{showProblem(JSON.stringify(item.x1))} 
                                                                 x2:{showProblem(JSON.stringify(item.x2))}
                                                                 x3:{showProblem(JSON.stringify(item.x3))}
                                                                 y:{showProblem(JSON.stringify(item.y))}
                                                </MathJaxContext>
                                            )
                                        }
                                    </MenuItem>) : null}

                            </Select>
                        </FormControl>
                    </div>
                </div>

            </div>

            <br />
            {/* <div> Problem is : {problem} </div> */}

            <form className='form'>

                <div className='input-div'>

                    <div className='equation-input-div'>

                    </div>

                    <div className='x-input-div'>

                    </div>

                    <div className='button-submit'>
                        <Button variant="contained" type='submit' value='Submit' > Submit </Button>
                    </div>


                </div>

            </form>

            <br />

            <div className='content' style={{ textAlign: 'center', justifyContent: 'center' }}>

                <div className='problem-div'>


                    <div style={{ height: 400, width: '100%', justifyContent: 'center' }}>

                    </div>
                    <div className='showProblem'>
                        <div className='showX'>
                            <h2>{JSON.stringify(x)}</h2>
                        </div>
                        <div className='showY'>
                            <h2>{JSON.stringify(y)}</h2>
                        </div>
                    </div>

                </div>

                <div className='answer-div'>
                    <h2> answer is Y = {answer} </h2>
                </div>

            </div>



        </div>

    )
}

export default LinearRegression