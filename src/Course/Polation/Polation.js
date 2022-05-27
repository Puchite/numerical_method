import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import * as math from 'mathjs'
import { MathJax, MathJaxContext } from 'better-react-mathjax'
import { DataGrid } from '@mui/x-data-grid';
import './Polation.css'
import { TextField } from '@mui/material';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

// import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from "chart.js"
// import { Bar, Line } from "react-chartjs-2"; 


let e = Math.E
let epsilon = 0.000001
const baseUrl = 'http://localhost:3001/root-equation/'

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
    { value: "newtonDivide", label: "Newton's Divided-Differences Method" },
    { value: "lagrange", label: "Lagrange Interpolation Method" },
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
        editable: true,
        sortable: false,
    },
    {
        field: 'y',
        headerName: 'Y',
        width: 150,
        type: 'number',
        editable: true,
        sortable: false,
    }
];

// let token = JSON.parse(localStorage.getItem('token'))
let token = {};
const login = async () => {
    await axios.post('https://numerical-react-api.herokuapp.com/login', {
        email: "s6204062616316@email.kmutnb.ac.th",
        password: "0859150757"
    }).then((res) => {
        token = res.data
        sessionStorage.setItem('token', JSON.stringify(token));
        
    })
}
login();
function Polation() {

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

    let tempAnswer;

    useEffect(() => {

        if (isfirstRender.current) {
            // login();
            getData();
            isfirstRender.current = false
            
        }
        else {
            equationRef.current = equation
            problemRef.current = problem
            chartDataRef.current = chartData
            rowTableRef.current = rowTable
            xRef.current = x
            yRef.current = y
            findXRef.current = findX
        }



    }, [equation, problem, chartData, rowTable, x, y, findX]);


    const getData = async () => {
        // await axios.get('http://localhost:3001/root-equation')
        // await axios.get('https://my-json-server.typicode.com/Puchite/numerical_method_api/root-equation')
        //     .then((res) => {
        //         
        //         const response = res.data
        //         setRes(response)

        //     }, (error) => {
        //         
        //     })

        await axios.get('https://numerical-react-api.herokuapp.com/polation', {
            headers: {
                "Authorization": `Bearer ${token.accessToken}`
            }
        }).then((res) => {
            const response = res.data;
            setRes(response);
            
        })
    }

    const handleEquationInput = (e) => {
        setEquation(e.target.value)
        
    }

    const handleMethod = (e) => {

        
        if (e.target.value === 'none') {
            setMethod('none')
        }
        else {
            setMethod(e.target.value)
            
            setProblem('Custom')
        }

        switch (e.target.value) {

            case "newtonDivide":
                setapiProblem(res.newtonDivide)
                break

            case 'lagrange':
                setapiProblem(res.lagrange)
                break

            case '2':
                setapiProblem()
                break

            case '3':
                setapiProblem()
                break

            default:
                
        }

    }

    const handleProblem = (e) => {

        setProblem(e.target.value)
        // setX(apiProblem[e.target.value-1].x)
        // setY(apiProblem[e.target.value-1].y)
        // 
        // let obj = []
        // for(let index = 0; index < apiProblem[e.target.value-1].x.length;  index++)
        // {
        //     
        //     
        //     obj.push({id:index, x:apiProblem[e.target.value-1].x[index], y:apiProblem[e.target.value-1].y[index]})
        // }

        // setRowTable(obj)
        // 
        if (e.target.value === 'Custom') {
            setDisableinput(false)
            setCustominput(true)
            setRowTable([
                {
                    id: '',
                    x: '',
                    y: ''
                }
            ])


        }
        else {
            setDisableinput(true)
            setCustominput(false)
            setX(apiProblem[e.target.value - 1].x)
            setY(apiProblem[e.target.value - 1].y)
            
            let obj = []
            for (let index = 0; index < apiProblem[e.target.value - 1].x.length; index++) {
                
                
                obj.push({ id: index, x: apiProblem[e.target.value - 1].x[index], y: apiProblem[e.target.value - 1].y[index] })
            }

            setRowTable(obj)
            
        }

    }

    const handlefindX = (e) => {
        setfindX(e.target.value)
    }

    const handleNumberOfX = (e) => {
        setNumberOfX(e.target.value)
        setTableInput(e.target.value)

        setX(Array(Number(e.target.value)).fill(0))
        setY(Array(Number(e.target.value)).fill(0))

        setXCustom(Array(Number(e.target.value)).fill(0))
        setYCustom(Array(Number(e.target.value)).fill(0))
    }

    const handleSubmit = (e) => {

        e.preventDefault();

        if (customInput === true) {
            setProblem(equation)
            callMethodCustom(method)

        }
        else {
            callMethod(method)
        }

    }

    function callMethod(method) {
        switch (method) {
            case 'newtonDivide':
                tempAnswer = calnewtonDivide(x, y)
                setAnswer(tempAnswer)
                break

            case 'lagrange':
                calLagrange(x, y, findX)
                break

            case '1':
                break

            case '2':
                break

            default:
                

        }
    }

    function callMethodCustom(method) {
        switch (method) {
            case 'newtonDivide':
                tempAnswer = calnewtonDivide(x, y)
                setAnswer(tempAnswer)
                break

            case 'lagrange':
                calLagrange(x, y, findX)
                break

            case '3':
                break

            case '4':
                break

            default:
                

        }
    }


    function calnewtonDivide(x, y) {

        function recursiveC(x, y, c) {

            if (c === 0) {
                return c
            }
            else if (c > 0) {
                return recursiveC(x, y, c - 1)
            }
            else {

            }
        }
    }

    function calLagrange(x, y, findX) {
        
        let xx = parseInt(findX)
        let round = x.length
        let l = 0
        

        for (let i = 0; i < round; i++) {
            let l_top = 1
            let l_divider = 1
            for (let j = 0; j < round; j++) {
                if (j !== i) {
                    // 
                    l_top *= (x[j] - xx)
                    // 
                    l_divider *= (x[j] - x[i])
                    // 
                    // 
                }
            }
            // 
            l += (l_top / l_divider) * y[i]
            // 
            // 
        }

        // 
        setAnswer(l)
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

    const setTableInput = (length) => {
        try {
            let obj = []
            for (let index = 1; index <= length; index++) {
                obj.push({ id: index, x: 0, y: 0 })
            }

            setRowTable(obj)
        } catch (error) {

        }
    }
    return (

        <div className='entire_page'>

            <div className='super_header'>

                <h1>
                    This is Polation Course
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
                                inputProps={{
                                    "data-testid" : "select-method"
                                }}
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
                                inputProps={{"data-testid" : "select-problem"}}
                                labelId="select-problem"
                                id="problem-select"
                                value={problem}
                                label="problem"
                                onChange={handleProblem}
                            >
                                <MenuItem value='Custom'> Custom </MenuItem>
                                {apiProblem ? apiProblem.map(item =>
                                    <MenuItem value={item.id}>
                                        <MathJaxContext>x:{showProblem(JSON.stringify(item.x))} y:{showProblem(JSON.stringify(item.y))}</MathJaxContext>
                                    </MenuItem>) : null}

                            </Select>
                        </FormControl>
                    </div>
                </div>

            </div>

            <br />
            {/* <div> Problem is : {problem} </div> */}

            <form className='form' onSubmit={handleSubmit}>

                <div className='input-div'>

                    <div className='equation-input-div'>

                        <TextField
                            label='Number of X'
                            type='number'
                            onChange={handleNumberOfX}
                            id='numberofX'
                            variant="outlined"
                            disabled={disableInput}
                            placeholder='Number of X'
                        />
                    </div>

                    <div className='x-input-div'>
                        <TextField
                            label='Point of X'
                            type='number'
                            onChange={handlefindX}
                            id='pointofX'
                            variant="outlined"
                            // disabled={disableInput}
                            placeholder='Point of X'
                            inputProps={{"data-testid" : "x-input"}}
                        />
                    </div>

                    <div className='button-submit'>
                        <Button variant="contained" type='submit' value='Submit' > Submit </Button>
                    </div>
                    
                    <div className='number of x'>
                                <h3>Number of X and Y is {numberOfX}</h3>
                    </div>
                    
                </div>

            </form>

            <br />

            <div className='content' style={{ textAlign: 'center', justifyContent: 'center' }}>

                <div className='problem-div'>


                    <div style={{ height: 400, width: '100%', justifyContent: 'center' }}>
                        <DataGrid

                            rows={rowTable}
                            columns={columnsTable}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            checkboxSelection
                            onCellEditCommit={event => {
                                
                                if(event.field === 'x')
                                {
                                    let newX = JSON.parse(JSON.stringify(xCustom))                
                                    newX[event.id-1] = event.value

                                    setXCustom(newX)

                                }
                                else if(event.field === 'y')
                                {
                                    let newY = JSON.parse(JSON.stringify(yCustom))
                                    newY[event.id-1] = event.value

                                    setYCustom(newY)
                                }
                            }}
                            
                            onSelectionModelChange={(newSelection) => {

                                if(problem === 'Custom')
                                {
                                    let arrX = []
                                    let arrY = []
                                    
                                    for (let index in newSelection) {
                                        
                                        arrX.splice(index, 0, xCustom[newSelection[index]-1])
                                        arrY.splice(index, 0, yCustom[newSelection[index]-1])
                                    }

                                    setX(arrX)
                                    setY(arrY)
                                    setSelection(newSelection)
                                }
                                else
                                {
                                    let arrX = []
                                    let arrY = []

                                    for (let index in newSelection) {
                                        arrX.splice(index, 0, apiProblem[problem - 1].x[newSelection[index]])
                                        arrY.splice(index, 0, apiProblem[problem - 1].y[newSelection[index]])
                                    }

                                    setX(arrX)
                                    setY(arrY)
                                    setSelection(newSelection)
                                }
                                

                            }}
                            selectionModel={selection}
                        />
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

export default Polation;