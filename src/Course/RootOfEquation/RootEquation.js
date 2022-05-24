import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import { MathJax, MathJaxContext } from 'better-react-mathjax'
import * as math from 'mathjs'
import { useEffect, useRef, useState } from 'react'
import {
    CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis,
    YAxis
} from "recharts"
import './RootEquation.css'

let epsilon = 0.000001
let token;

const methodOption = [
    { value: "bisection", label: "Bisection Method" },
    { value: "falsePosition", label: "False Position Method" },
    { value: "onePoint", label: "One Point Method" },
    { value: "newtonRaphson", label: "Newton Raphson Method" },
]

const login = async () => {
    await axios.post('http://localhost:3001/login', {
        email: "s6204062616316@email.kmutnb.ac.th",
        password: "0859150757"
    }).then((res) => {
        token = res.data
        console.log("Token is ", token)
    })
}


function RootEquation() {

    const [left, setLeft] = useState('-10')
    const [right, setRight] = useState('10')
    const [start, setStart] = useState(0)
    const [bound, setBound] = useState({ left: 0, right: 10 })
    const [table, SetTable] = useState({ "rowsTable": [], "columnsTable": [] })
    const [equation, setEquation] = useState('')
    const [answer, setAnswer] = useState(0)
    const [dataError, setDataError] = useState([])
    const [chartData, setChartData] = useState([])
    const [chartAnswer, setChartAnswer] = useState([])
    const [apiProblem, setapiProblem] = useState('')
    const [problem, setProblem] = useState('Custom')
    const [disableInput, setDisableinput] = useState(true)
    const [customInput, setCustominput] = useState(false)
    const [method, setMethod] = useState('none')
    const [res, setRes] = useState([])
    // const [ token, setToken ] = useState([])


    const isfirstRender = useRef(true)
    const equationRef = useRef(equation)
    const problemRef = useRef(problem)
    const chartDataRef = useRef(chartData)
    const chartAnswerRef = useRef(chartAnswer)

    let tempAnswer;
    let tempObj;


    useEffect(() => {

        // const login = async () =>  {
        //     await axios.post('http://localhost:3001/login',{
        //       email: "s6204062616316@email.kmutnb.ac.th",
        //       password: "0859150757"
        //     }).then((res) => {
        //       const response = res.data
        //       setToken(response)
        //       console.log("Token is ",token)
        //     })
        //   }

        // console.log(res)
        // const getData = async () => {
        //     // await axios.get('http://localhost:3001/root-equation')
        //     await axios.get('https://my-json-server.typicode.com/Puchite/numerical_method_api/root-equation')
        //                                .then((res) =>{
        //                                     console.log('fetch success data is', res.data)
        //                                     const response = res.data
        //                                     setRes(response)

        //                                 }, (error) => {
        //                                     console.log(error)})
        //     console.log("ACCESS TOKEN ",token)
        //     await axios.get('http://localhost:3001/root-equation', {
        //         headers:{
        //             "Authorization" : `Bearer ${token.accessToken}`
        //         }
        //     }).then((response) =>{
        //         console.log("get with token data is ",response.data)
        //     })
        // }

        if (isfirstRender.current) {
            login();
            getData();
            isfirstRender.current = false
            console.log("*This is First Render")
        }
        else {
            equationRef.current = equation
            problemRef.current = problem
            chartDataRef.current = chartData
            chartAnswerRef.current = chartAnswer
        }

    }, [equation, problem, chartData, chartAnswer])

    // const login = async () =>  {
    //     await axios.post('http://localhost:3001/login',{
    //       email: "s6204062616316@email.kmutnb.ac.th",
    //       password: "0859150757"
    //     }).then((res) => {
    //       const response = res.data
    //       setToken(response)
    //       console.log("Token is ",token)
    //     })
    //   }

    const getData = async () => {
        // await axios.get('http://localhost:3001/root-equation')
        await axios.get('https://my-json-server.typicode.com/Puchite/numerical_method_api/root-equation')
            .then((res) => {
                console.log('fetch success data is', res.data)
                const response = res.data
                setRes(response)

            }, (error) => {
                console.log(error)
            })

        console.log("ACCESS TOKEN ", token)
        await axios.get('http://localhost:3001/root-equation', {
            headers: {
                "Authorization": `Bearer ${token.accessToken}`
            }
        }).then((response) => {
            console.log("get with token data is ", response.data)
        })
    }

    const handleLeftInput = (e) => {

        if (e.target.value === '') {
            setLeft('-100')
        }
        else {
            setLeft(e.target.value)
        }

    }

    const handleRightInput = (e) => {

        if (e.target.value === '') {
            setRight('100')
        }
        else {
            setRight(e.target.value)
        }

    }

    const handleStartInput = (e) => {
        setStart(e.target.value)
    }

    const handleEquationInput = (e) => {
        setEquation(e.target.value)
        console.log(equation)
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

        if (e.target.value === 'Custom') {
            setDisableinput(false)
            setCustominput(true)
        }
        else {
            setDisableinput(true)
            setCustominput(false)
        }

    }

    const handleSubmit = (e) => {

        e.preventDefault();

        if (customInput === true) {
            setProblem(equation)
            callMethodCustom(method)

            try {
                console.log('equation:' + equation + ' answer: ' + answer)
                console.log("tempAnswer: " + tempAnswer)
                let point = "(" + tempAnswer + ",0)"

            } catch (error) {
                console.log("update Plot Error")
            }

        }
        else {
            callMethod(method)

            try {

                let point = "(" + tempAnswer + ",0)";
                let xLeft = "x=" + left;
                let xRight = "x=" + right;

                if (method === 'bisection' || method === 'falsePosition');
                // eslint-disable-next-line no-lone-blocks
                {

                    // let xLeft = "x="+left;
                    // let xRight = "x="+right;                    

                    // for(let i=0; i<Object.keys(table.rowsTable).length; i++)
                    // {
                    //     // eslint-disable-next-line no-loop-func
                    //     setTimeout(() => {
                    //         console.log("iteration ",i)
                    //         let xLeft = "x="+table.rowsTable[i].xl;
                    //         let xRight = "x="+table.rowsTable[i].xr;
                    //         calculator.setExpression({ id: 'left', latex: xLeft});
                    //         calculator.setExpression({ id: 'right', latex: xRight});
                    //         console.log("xl ",table.rowsTable[i].xl)
                    //         console.log("xr ",table.rowsTable[i].xr)

                    //     },i*5000)
                    // }

                }

            } catch (error) {
                console.log("update Plot Error");
            }
        }


    }

    function callMethod(method) {
        switch (method) {
            case 'bisection':
                console.log('bisection')
                console.log('equation: ' + problem + ' left: ' + left + ' right:' + right)
                setAnswer(calBisection(problem, left, right))
                console.log("tempObj", tempObj)
                tempAnswer = calBisection(problem, left, right).toFixed(6)
                console.log("Temp answer:" + tempAnswer)
                setAnswer(tempAnswer)

                // tempObj = calculateBisection(problem, left, right, epsilon);
                // tempAnswer = Object(tempObj)[Object.keys(tempObj).length-1].xm 
                // setAnswer(Object(tempObj)[Object.keys(tempObj).length-1].xm);

                // let dataError = [];
                // let dataAnswer = [];
                // for(let i=1; i<Object.keys(tempObj).length; i++)
                // {
                //     let tempAnswerObj = {};
                //     tempAnswerObj = Object.assign(tempAnswerObj, {"answer":tempObj[i].xm});
                //     dataAnswer.push(tempAnswerObj);

                //     let tempErrorObj = {};
                //     if(tempObj[i].error === Infinity)
                //     {
                //         tempErrorObj = Object.assign(tempErrorObj, {"error": 1});
                //     }
                //     else
                //     {
                //         tempErrorObj = Object.assign(tempErrorObj, {"error":tempObj[i].error});
                //     }                    
                //     dataError.push(tempErrorObj);
                // }

                // setChartAnswer(dataAnswer);
                // setChartData(dataError);

                break;

            case 'falsePosition':
                // tempObj = calculateFalsePosition(equation, left, right, epsilon)
                // console.log(tempObj)
                console.log('falsePosition')
                console.log('equation: ' + problem + ' left: ' + left + ' right: ' + right)
                tempAnswer = calFalsePosition(problem, left, right)
                console.log("Temp answer:" + tempAnswer)
                setAnswer(tempAnswer)


                break

            case 'onePoint':
                console.log('onePoint')
                console.log('equation: ' + problem + ' start: ' + start)
                tempAnswer = calOnePoint(problem, start)
                console.log("Temp answer:" + tempAnswer)
                setAnswer(tempAnswer)
                break

            case 'newtonRaphson':
                console.log('newtonRaphson')
                console.log('equation: ' + problem + ' start: ' + start)
                tempAnswer = calNewton(problem, start)
                console.log("Temp answer:" + tempAnswer)
                setAnswer(tempAnswer)
                break

            default:
                console.log('No Method Found')

        }


    }

    function callMethodCustom(method) {
        switch (method) {
            case 'bisection':
                console.log('bisection')
                console.log('equation: ' + equation + ' left: ' + left + ' right:' + right)
                // setAnswer(calBisection(problem, left, right))
                tempAnswer = calBisection(equation, left, right)
                console.log("Temp answer:" + tempAnswer)
                setAnswer(tempAnswer)
                break

            case 'falsePosition':
                console.log('falsePosition')
                console.log('equation: ' + equation + ' left: ' + left + ' right: ' + right)
                tempAnswer = calFalsePosition(equation, left, right)
                console.log("Temp answer:" + tempAnswer)
                setAnswer(tempAnswer)
                break

            case 'onePoint':
                console.log('onePoint')
                console.log('equation: ' + equation + ' start: ' + start)
                tempAnswer = calOnePoint(equation, start)
                console.log("Temp answer:" + tempAnswer)
                setAnswer(tempAnswer)
                break

            case 'newtonRaphson':
                console.log('newtonRaphson')
                console.log('equation: ' + equation + ' start: ' + start)
                tempAnswer = calNewton(equation, start)
                console.log("Temp answer:" + tempAnswer)
                setAnswer(tempAnswer)
                break

            default:
                console.log('No Method Found')

        }
    }

    function calFunction(equation, xq) {

        try {
            let eq = math.parse(equation)
            return eq.evaluate({ x: xq })
        } catch (error) {
            console.log("Equation Error")
        }

    }

    function calBisection(equation, xl, xr) {

        console.log("bound ", bound.left)
        xl = parseFloat(xl)
        xr = parseFloat(xr)
        let dataError = []
        let dataAnswer = []
        let xm = ((xl + xr) / 2)
        let c = 1
        let temp = 0
        let fxm = 0
        let fxr = 0
        let round = 1
        let objTable = []

        while (c > epsilon) {

            // console.log("Iteration: ",round) 

            fxm = calFunction(equation, xm)
            fxr = calFunction(equation, xr)

            if (fxm * fxr > 0) {
                temp = xr
                xr = xm
            }
            else {
                temp = xl
                xl = xm
            }

            c = (xm - temp) / xm
            c = Math.abs(c)

            // console.log("Error :" ,c)
            if (!isFinite(c) || isNaN(c)) {
                console.log("C is inf or NaN")
                c = 1;
                dataError.push({ error: 1 })
            }
            else {
                dataError.push({ error: c })
            }

            xm = (xl + xr) / 2
            dataAnswer.push({ answer: xm })

            objTable.push({ id: round, xl: xl.toFixed(6), xr: xr.toFixed(6), xm: xm.toFixed(6), error: c.toFixed(6) })
            round = round + 1
            // console.log("--------------------------")
        }

        console.log("DataError: ", dataError)
        setChartData(dataError)
        setChartAnswer(dataAnswer)

        const columnsTemp = [
            {
                field: 'id',
                headerName: 'Iteration',
                width: 70,
                type: 'number',
                editable: false,
                sortable: false,
            },
            {
                field: 'xl',
                headerName: 'Left',
                width: 150,
                type: 'number',
                editable: false,
                sortable: false,
            },
            {
                field: 'xr',
                headerName: 'Right',
                width: 150,
                type: 'number',
                editable: false,
                sortable: false,
            },
            {
                field: 'xm',
                headerName: 'XM',
                width: 150,
                type: 'number',
                editable: false,
                sortable: false,
            },
            {
                field: 'error',
                headerName: 'Error',
                width: 150,
                type: 'number',
                editable: false,
                sortable: false,
            }
        ];

        let test = Object.keys(objTable)[Object.keys(objTable).pop()]
        console.log("test is ", test)
        console.log("obj is ", objTable[test].xm)
        console.log("Last Object ", Object.keys(objTable)[Object.keys(objTable).length - 1])
        SetTable(
            {
                columnsTable: columnsTemp,
                rowsTable: objTable
            }
        )


        return xm

    }

    function calFalsePosition(equation, xl, xr) {

        xl = parseFloat(xl)
        xr = parseFloat(xr)
        let dataError = []
        let dataAnswer = []
        let x1 = 0
        let c = 1
        let temp = 0
        let objTable = []
        let round = 1

        while (round < 100) {

            console.log("Iteration ", round)
            let fx1 = calFunction(equation, x1)
            let fxl = calFunction(equation, xl)
            let fxr = calFunction(equation, xr)

            x1 = ((xl * fxr) - (xr * fxl)) / (fxr - fxl)
            dataAnswer.push({ answer: x1 })

            if (fx1 * fxr > 0) {
                temp = xr
                xr = x1
            }
            else {
                temp = xl
                xl = x1
            }

            c = (x1 - temp) / x1
            c = Math.abs(c)


            if (!isFinite(c) || isNaN(c)) {
                console.log("C is inf or NaN")
                c = 1
                dataError.push({ error: 1 })
            }
            else {
                dataError.push({ error: c })
            }

            // objTable.push({id:round, xl:xl.toFixed(6), xr:xr.toFixed(6), x:x1.toFixed(6), error:c.toFixed(6)})
            objTable.push({ id: round, xl: xl.toFixed(6), xr: xr.toFixed(6), x: x1.toFixed(6), error: c.toFixed(6) })
            round = round + 1

            if (c < epsilon) {
                break;
            }
        }

        console.log("DataError: ", dataError)
        setChartData(dataError)
        setChartAnswer(dataAnswer)

        const columnsTemp = [
            {
                field: 'id',
                headerName: 'ID',
                width: 70,
                type: 'number',
                editable: false,
                sortable: false,
            },
            {
                field: 'xl',
                headerName: 'Left',
                width: 150,
                type: 'number',
                editable: false,
                sortable: false,
            },
            {
                field: 'xr',
                headerName: 'Right',
                width: 150,
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
                field: 'error',
                headerName: 'Error',
                width: 150,
                type: 'number',
                editable: false,
                sortable: false,
            }
        ];


        SetTable(
            {
                columnsTable: columnsTemp,
                rowsTable: objTable
            }
        )

        return x1.toFixed(6)

    }

    function calOnePoint(equation, start) {

        let dataError = []
        let dataAnswer = []
        let x_old = parseFloat(start)
        let x_new = 0
        let c = 1
        let objTable = []
        let round = 1

        while (round < 100) {

            x_new = calFunction(equation, x_old)

            dataAnswer.push({ answer: x_new })

            c = Math.abs((x_new - x_old) / x_new)

            if (!isFinite(c) || isNaN(c)) {
                c = 1
                dataError.push({ error: 1 })
            }
            else {
                dataError.push({ error: c })
            }

            objTable.push({ id: round, x_new: x_new.toFixed(6), x_old: x_old.toFixed(6), error: c.toFixed(6) })
            x_old = x_new

            if (c < epsilon) {
                break;
            }
            // if(c === Infinity){

            //     console.log('Infinity')
            //     //   setChartData(dataError)
            //     //   setChartAnswer(dataAnswer)

            //     //   return x_old
            //     objTable.push({id:round, x_new:x_new.toFixed(6), x_old:x_old.toFixed(6), error:c.toFixed(6)})
            //     break
            // }

            // else
            // {                
            //     objTable.push({id:round, x_new:x_new.toFixed(6), x_old:x_old.toFixed(6), error:c.toFixed(6)})
            //     x_old = x_new                
            // }

            round = round + 1

        }

        console.log("DataError: ", dataError)
        setChartData(dataError)
        setChartAnswer(dataAnswer)

        const columnsTemp = [
            {
                field: 'id',
                headerName: 'ID',
                width: 70,
                type: 'number',
                editable: false,
                sortable: false,
            },
            {
                field: 'x_new',
                headerName: 'X New',
                width: 150,
                type: 'number',
                editable: false,
                sortable: false,
            },
            {
                field: 'x_old',
                headerName: 'X Old',
                width: 150,
                type: 'number',
                editable: false,
                sortable: false,
            },
            {
                field: 'error',
                headerName: 'Error',
                width: 150,
                type: 'number',
                editable: false,
                sortable: false,
            }
        ];


        console.log(objTable)
        SetTable(
            {
                columnsTable: columnsTemp,
                rowsTable: objTable
            }
        )

        return x_new

    }

    function calNewton(equation, start) {

        let dataError = []
        let dataAnswer = []
        let x_temp = 0
        let x_old = parseFloat(start)
        let x_new = 0
        let c = 1
        let round = 1
        let objTable = []

        while (round < 100) {

            console.log("Iteration: ", round)
            x_temp = -calFunction(equation, x_old) / calFunction(math.derivative(equation, 'x').toString(), x_old)
            console.log("Delta X: " + x_temp)
            x_new = x_old + x_temp
            console.log("X_new: " + x_new)
            dataAnswer.push({ answer: x_new })

            c = Math.abs((x_new - x_old) / x_new)
            console.log("Error: " + c)

            if (!isFinite(c) || isNaN(c)) {
                console.log("C is inf or NaN")
                c = 1
                dataError.push({ error: 1 })
            }
            else {
                dataError.push({ error: c })
            }

            objTable.push({ id: round, x_new: x_new.toFixed(6), x_old: x_old.toFixed(6), error: c.toFixed(6) })
            x_old = x_new

            if (c < epsilon) {
                break;
            }
            // if(c === Infinity || isNaN(c)){

            //     // setDataError(dataError)
            //     // setChartAnswer(dataAnswer)
            //     // return x_old
            //     objTable.push({id:round, x_new:x_new.toFixed(6), x_old:x_old.toFixed(6), error:c.toFixed(6)})
            //     return x_old
            // }      
            // else{
            //     objTable.push({id:round, x_new:x_new.toFixed(6), x_old:x_old.toFixed(6), error:c.toFixed(6)})
            //     x_old = x_new
            // }

            round = round + 1
        }

        setChartData(dataError)
        console.log("***Data Error is: ", dataError)
        setChartAnswer(dataAnswer)

        const columnsTemp = [
            {
                field: 'id',
                headerName: 'ID',
                width: 70,
                type: 'number',
                editable: false,
                sortable: false,
            },
            {
                field: 'x_new',
                headerName: 'X New',
                width: 150,
                type: 'number',
                editable: false,
                sortable: false,
            },
            {
                field: 'x_old',
                headerName: 'X Old',
                width: 150,
                type: 'number',
                editable: false,
                sortable: false,
            },
            {
                field: 'error',
                headerName: 'Error',
                width: 150,
                type: 'number',
                editable: false,
                sortable: false,
            }
        ];


        console.log(objTable)
        SetTable(
            {
                columnsTable: columnsTemp,
                rowsTable: objTable
            }
        )

        return x_new

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

    const showTable = (table) => {
        try {
            console.log(table)
            return <DataGrid
                rows={table.rowsTable}
                columns={table.columnsTable}
                pageSize={100}
                rowsPerPageOptions={[100]}
            />

        } catch (e) {
            console.log(e)
        }

    }

    const proveAnswer = (answer) => {
        try {
            if (method === 'onePoint') {
                let prove = ((calFunction(problem, answer)) - answer)
                return prove.toFixed(1)
            }
            else {
                let prove = (calFunction(problem, answer))
                return prove.toFixed(1)
            }

        } catch (error) {
            return "[Equation Error]"
        }

    }
    return (

        <div className='entire_page'>

            <div className='super_header'>

                <h1>
                    This is Root Equation
                </h1>

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
                                inputProps={{
                                    "data-testid" : "select-method"
                                }}
                            >
                                {methodOption.map((options) =>

                                    <MenuItem value={options.value}>{options.label}</MenuItem>)}

                            </Select>
                        </FormControl>
                    </div>
                            
                </div>


                {/* <label>Method:</label>
                <select onChange={handleMethod}>
                    <option value='none' >Select Method for Solving Equation</option>
                    {methodOption.map((options) => <option key={options.value} value={options.value}>{options.label}</option>)}

                </select>   */}


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
                                inputProps={{
                                    "data-testid" : "select-problem"
                                }}
                            >
                                <MenuItem value='Custom'> Custom </MenuItem>
                                {apiProblem ? apiProblem.map(item =>
                                    <MenuItem value={item.problem}>
                                        <MathJaxContext>{showProblem(item.problem)}</MathJaxContext>
                                    </MenuItem>) : null}

                            </Select>
                        </FormControl>
                    </div>
                </div>



                {/* <label>Problem:</label>
                <select onChange={handleProblem}>
                    <option defaultValue={null} value="none" >Select Equation</option>
                    <option value="Custom">Custom</option>
                    {apiProblem ? apiProblem.map(item => <option key={item.problem} >{item.problem}</option>):null}
                    
                </select>                                                             */}

            </div>

            {/* <div> Problem is : {problem} </div> */}

            <div className='form-div'>
                <form className='form' onSubmit={handleSubmit}>

                    {
                        ((method !== 'onePoint') && (method !== 'newtonRaphson') && (method !== 'none')) && (

                            <div className='input-div'>

                                <div className='equation-input-div'>
                                    <TextField
                                        inputProps={{
                                            "data-testid": "equation-input"
                                        }}

                                        label='Equation'
                                        type='text'
                                        onChange={handleEquationInput}
                                        id='equation'
                                        disabled={disableInput}
                                        variant="outlined"
                                        placeholder='Equation'
                                    />
                                    {/* <input 
                                type="text" 
                                onChange={handleEquationInput} 
                                disabled={disableInput} 
                                placeholder='equation'
                            /> */}
                                </div>

                                <div className='left-input-box'>

                                    <TextField
                                        inputProps={{
                                            "data-testid": "left-input"
                                        }}
                                        label='Left'
                                        type='text'
                                        onChange={handleLeftInput}
                                        id='left'
                                        variant="outlined"
                                        placeholder='BoundLeft'

                                    />
                                    {/* <input 
                                type="text" 
                                onChange={handleLeftInput}
                                placeholder='Default is -10'    
                            />                             */}
                                </div>

                                <div className='right-input-box'>
                                    <TextField
                                        inputProps={{
                                            "data-testid": "right-input"
                                        }}
                                        label='Right'
                                        type='text'
                                        onChange={handleRightInput}
                                        id='right'
                                        variant="outlined"
                                        placeholder='BoundRight'
                                    />
                                    {/* <label>Right:</label> 
                            <input 
                                type="text"   
                                onChange={handleRightInput} 
                                placeholder="Default is 10"
                            /> */}
                                </div>

                                <div className='button'>
                                    {/* <input type="submit" value="Submit" /> */}
                                    <Button inputProps={{
                                        "data-testid": "submit-button"
                                    }} variant="contained" type='submit' value='Submit' > Submit </Button>
                                </div>


                            </div>
                        )}
                    {
                        ((method !== 'bisection') && (method !== 'falsePosition') && (method !== 'none')) && (

                            <div className='input-div'>

                                <div className='equation-input-div'>
                                    {/* <label>Equation:</label>
                            <input 
                                
                                type="text" 
                                onChange={handleEquationInput} 
                                disabled={disableInput} 
                                placeholder='equation'
                            /> */}
                                    <TextField
                                        label='Equation'
                                        type='text'
                                        onChange={handleEquationInput}
                                        id='equation'
                                        disabled={disableInput}
                                        variant="outlined"
                                        placeholder='Equation'
                                    />
                                </div>

                                <div className='start-input-box'>
                                    {/* <label>Start:</label>
                            <input 
                                type="text" 
                                // value={left} 
                                onChange={handleStartInput}
                                // disabled={disableInput} 
                                placeholder='Default is 0'    
                            /> */}
                                    <TextField
                                        label='Start'
                                        type='text'
                                        onChange={handleStartInput}
                                        id='start'
                                        variant="outlined"
                                        // disabled={disableInput}
                                        placeholder='Start'
                                    />
                                </div>

                                <div className='button'>
                                    {/* <input type="submit" value="Submit" /> */}
                                    <Button variant="contained" type='submit' value='Submit' > Submit </Button>
                                </div>

                            </div>

                        )}

                </form>
            </div>

            <br />

            <div className='content' style={{ textAlign: 'center' }}>

                        <div className='problem-div'>
                            <div className='problem'>
                                <h2>
                                    Method is {method}
                                </h2>
                                <h2> Equation
                                    <MathJaxContext>
                                        {showProblem(problem)}
                                    </MathJaxContext>
                                </h2>

                            </div>

                        </div>


                        <div className='answer-div'>

                            {
                                ((isNaN(answer)) || (answer === Infinity)) && (

                                    <div className='answer'>
                                        <h2> Equation Error </h2>
                                    </div>
                                )
                            }
                            {
                                (!isNaN(answer)) && (

                                    <div className='answer'>
                                        {/* <h2> Answer of Equation {answer} </h2> */}
                                        <h2> Answer of Equation
                                            <MathJaxContext id='answer'>
                                                {showProblem(answer)}
                                            </MathJaxContext>
                                        </h2>
                                    </div>
                                )
                            }

                        </div>

                        <div className='prove-div'>

                            {
                                ((answer !== 0) || (isFinite(answer) || (isNaN(answer)))) && (
                                    <div className='prove'>
                                        <h2> Prove Answer <MathJaxContext> {showProblem(problem.replace(/\x/g, answer))} = {showProblem(proveAnswer(answer))} </MathJaxContext> </h2>
                                    </div>
                                )
                            }
                            {/* {
                        (answer === 0) && (
                            <div className='prove'>
                                <h2> Prove Answer {proveAnswer(answer)} </h2>
                            </div>
                        )
                    } */}
                            {/* <h2> Prove Answer is <MathJaxContext> {showProblem(problem.replace(/\x/g, answer))} </MathJaxContext> = {proveAnswer(answer)} </h2> */}
                        </div>

            </div>

            {/* <div className='plot-div'>
                <div className='plot' id='elt' style={{ width: '800px', height: '600px', }}> </div>
            </div> */}


            <div className='chart'>


                <div className='error-chart'>
                    <label>Error</label>

                    <LineChart
                        width={1000}
                        height={600}
                        data={chartData}
                        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    >

                        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                        <XAxis />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="error" stroke="#F1230A" strokeWidth={5} />
                    </LineChart>

                </div>


                <div className='answer-chart'>
                    <label>Answer</label>
                    <LineChart
                        width={1000}
                        height={600}
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


            <div className='table' style={{ textAlign: 'center' }}>

                <div className='table-iteration'>
                    <div style={{ height: 1000, width: 1000 }}>
                        {showTable(table)}
                    </div>
                </div>


            </div>

            {/* <SyntaxHighlighter className="code" language="javascript" style={xonokai} showLineNumbers='true' >
                {codeString+codeString2}
            </SyntaxHighlighter>         */}


        </div>

    )
}

export default RootEquation;