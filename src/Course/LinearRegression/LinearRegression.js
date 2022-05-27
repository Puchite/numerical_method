import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import * as math from 'mathjs'
import { MathJax, MathJaxContext } from 'better-react-mathjax'
import { DataGrid } from '@mui/x-data-grid';
import { TextField } from '@mui/material';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

let tempAnswer = [];
const methodOption = [
    { value: "linear", label: "Linear Regression" },
    { value: "polynomial", label: "Polynomial Regression" },
    { value: "multiple", label: "Multiple Regression" },
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
    const [answer, setAnswer] = useState([0])
    
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
    const answerRef = useRef(answer);
    const xRef = useRef(x)
    const yRef = useRef(y)
    const findXRef = useRef(findX)

    useEffect(() => {

        if (isfirstRender.current) {
            login();
            getData();
        }
        else {
            answerRef.current = answer;
            equationRef.current = equation
            problemRef.current = problem
            chartDataRef.current = chartData
        }

    }, [equation, problem, chartData, chartAnswer, answer])

    const getData = async () => {
        await axios.get('https://numerical-react-api.herokuapp.com/linearRegression', {
            headers: {
                "Authorization": `Bearer ${token.accessToken}`
            }
        }).then((response) => {
            
        })
    }

    const handleMethod = (e) => {

        
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
                
                break

            case 'polynomial':
                setapiProblem(res.polynomial)
                break

            case 'multiple':
                setapiProblem(res.multiple)
                break

            default:
                
        }

    }

    const handleProblem = (e) => {

        setProblem(e.target.value)
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
            setY(apiProblem[e.target.value - 1].fx)
            
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
            case 'linear':
                tempAnswer = linear(x, y);
                // setAnswer(tempAnswer)
                
                break

            case 'polynomial':
                polynomial(x, y);
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
            case 'linear':
                tempAnswer = linear(x, y)
                setAnswer(tempAnswer)
                break

            case 'lagrange':
                polynomial(x, y);
                break

            case '3':
                break

            case '4':
                break

            default:
                

        }
    }
    
    function linear(x, y){
        var matrixX = JSON.parse(JSON.stringify(x));
        var matrixY = JSON.parse(JSON.stringify(y));

        var sumMatrixX = math.sum(matrixX);
        var sumMatrixY = math.sum(matrixY);
        var matrixXY = math.sum(math.multiply(matrixX, matrixY));
        var matrixPowX = math.sum(math.multiply(matrixX, matrixX))
        var matrixA = [[matrixX.length, sumMatrixX], [sumMatrixX, matrixPowX]];
        var matrixB = [sumMatrixY, matrixXY];
        var Xnew = [];  
        var temp;
        let ans = [];

        for(let i=0; i < matrixA.length; i++)
        {
            Xnew = [[matrixX.length, sumMatrixX], [sumMatrixX, matrixPowX]];
            for(let j=0; j<matrixA.length; j++)
            {
                Xnew[j][i] = matrixB[j];
            }

            temp = (math.det(Xnew) / math.det(matrixA));

            let obj = {};
            Object.assign(obj, {["round"+i]:temp});
            ans.push(obj);            
        }
        setAnswer(ans);

        return;

    }

    function polynomial(x, y){

    }

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
                                inputProps={{
                                    "data-testid" : "select-problem"
                                }}
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
                        />
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
                    <h2> answer is = {JSON.stringify(answer)} </h2>
                </div>

            </div>



        </div>

    )
}

export default LinearRegression