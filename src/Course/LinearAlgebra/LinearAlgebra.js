import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import * as math from 'mathjs';
import { column, derivative, evaluate, index, json, parse, row } from 'mathjs';
import React, { useEffect, useRef, useState } from 'react';
import './LinearAlgebra.css';

let e = Math.E
let epsilon = 0.000001
let ep = 0.0001;
let elt;
let calculator;

const methodOption = [
    { value: "cramerRule", label: "Crammer's Rule" },
    { value: "gaussElimination", label: "Gauss Elimination Method" },
    { value: "gaussJordan", label: "Gauss Jordan Method" },
    { value: "jacobi", label: "Jacobi Method" },
    { value: "gaussSeidel", label: "Gauss Seidel Method" },
    { value: "conjugate", label: "Conjugate Method" },

]


function LinearAlgebra() {
    // const [ bound, setBound ] = useState({left:'0',right:'0'})
    const [matrixA, setMatrixA] = useState([0])
    const [matrixB, setMatrixB] = useState([0])
    const [matrixProve, setMatrixProve] = useState([0])
    const [matrixLenght, setMatrixLength] = useState(0)
    const [matrixSize, setMatrixSize] = useState({ rows: 0, columns: 0 })
    const [chartData, setChartData] = useState([])
    const [chartError, setChartError] = useState([])
    const [equation, setEquation] = useState('')
    const [answer, setAnswer] = useState(0)
    const [apiProblem, setapiProblem] = useState('')
    const [problem, setProblem] = useState('Custom')
    const [disableInput, setDisableinput] = useState(true)
    const [customInput, setCustominput] = useState(false)
    const [method, setMethod] = useState('none')
    const [res, setRes] = useState([])
    const isfirstRender = useRef(true)
    const matrixARef = useRef(matrixA)
    const matrixBRef = useRef(matrixB)
    const matrixSizeRef = useRef(matrixSize)
    const equationRef = useRef(equation)
    const problemRef = useRef(problem)
    const chartDataRef = useRef(chartData)
    let tempAnswer;

    useEffect(() => {

        if (isfirstRender.current) {
            getData()
            isfirstRender.current = false
            console.log("*This is First Render")
        }
        else {

            matrixARef.current = matrixA
            matrixBRef.current = matrixB
            matrixSizeRef.current = matrixSize
            equationRef.current = equation
            problemRef.current = problem
            chartDataRef.current = chartData
        }

    }, [equation, problem, chartData, matrixA, matrixB, matrixSize]);


    const getData = async () => {
        // await axios.get('http://localhost:3001/linear')
        await axios.get('https://my-json-server.typicode.com/Puchite/numerical_method_api/linear')
            .then((res) => {
                console.log('fetch success data is', res.data)
                const response = res.data
                setRes(response)

            }, (error) => {
                console.log(error)
            })

    }


    const handleMethod = (e) => {

        setAnswer([0])
        setMatrixProve([0])
        setMatrixA([0])
        setMatrixB([0])
        console.log(e.target.value)
        if (e.target.value === 'none') {
            setMethod('none')
        }
        else {
            setMethod(e.target.value)
            setProblem(0)
        }

        switch (e.target.value) {

            case 'cramerRule':
                setapiProblem(res.cramerRule)
                break

            case 'gaussElimination':
                setapiProblem(res.gaussElimination)
                break

            case 'gaussJordan':
                setapiProblem(res.gaussJordan)
                break

            case "jacobi":
                setapiProblem(res.jacobi)
                break

            case 'gauss-seidel':
                setapiProblem(res.gaussSeidel)
                break

            case 'conjugate':
                setapiProblem(res.conjugate)
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
            setMatrixA(apiProblem[e.target.value - 1].matrixA)
            setMatrixB(apiProblem[e.target.value - 1].matrixB)
            setDisableinput(true)
            setCustominput(false)
        }

    }

    const handleMatrixAInput = (e) => {
        // setMatrixA(e.target.value)

        let arrayA = []
        let arrayTemp = []

        if (typeof (matrixA) === 'string') {
            arrayTemp = JSON.parse(matrixA)
        }
        else {
            arrayTemp = JSON.parse(JSON.stringify(matrixA))
        }

        if (arrayTemp.length < 2) {
            arrayTemp = []
            for (let rows = 0; rows < parseInt(matrixSize.rows); rows++) {
                arrayTemp.push(new Array(parseInt(matrixSize.columns)).fill(0))
            }
        }

        let sizeString = (e.target.id).split("");
        let row = parseInt(sizeString[0])
        let column = parseInt(sizeString[1])

        for (let rows = 0; rows < parseInt(matrixSize.rows); rows++) {
            arrayA.push(new Array(parseInt(matrixSize.columns)).fill(0))
        }

        // arrayA[row][column] = parseFloat(e.target.value)  
        console.log(typeof (arrayTemp))
        arrayTemp[row][column] = parseFloat(e.target.value)
        setMatrixA(JSON.stringify(arrayTemp))
    }

    const handleMatrixBInput = (e) => {

        let arrayA = []
        let arrayTemp = []



        if (arrayTemp.length < 2) {
            console.log("Array Temp ", arrayTemp)
            arrayTemp = []
            arrayTemp = Object.assign(arrayTemp, Array(parseInt(matrixSize.rows)).fill(0))
            // for(let rows = 0; rows<parseInt(matrixSize.rows); rows++)
            // {
            //     arrayTemp.push(new Array(parseInt(matrixSize.columns)).fill(0))
            // }
        }

        let sizeString = (e.target.id).split("");
        let row = parseInt(sizeString[0])
        console.log(typeof (arrayTemp))
        // arrayA[row][column] = parseFloat(e.target.value)    
        arrayTemp[row] = parseFloat(e.target.value)
        setMatrixB(JSON.stringify(arrayTemp))
    }

    const handleSubmit = (e) => {

        e.preventDefault();

        // checkMatrixTranspose(matrixA)
        switch (method) {
            case 'cramerRule':
                calCrammerRule(matrixA, matrixB)
                break

            case 'gaussElimination':
                calGuassElimination(matrixA, matrixB)

                break

            case 'gaussJordan':
                calGuassJordan(matrixA, matrixB)

                break

            case 'jacobi':
                if (checkMatrixTranspose(matrixA) === false) {
                    setAnswer("Matrix A is non-symmetric matrix")
                    return
                }
                calJacobi(matrixA, matrixB)

                break

            case 'gaussSeidel':
                calGaussSeidel(matrixA, matrixB)

                break

            case 'conjugate':
                calConjugate(matrixA, matrixB)

                break

            default:
                console.log("No Method Found")
        }
    }

    function calCrammerRule(matrixA, matrixB) {

        let dataError = []
        let matrixAForm = JSON.parse(matrixA)
        console.log("MatrixA: ", matrixAForm)
        let matrixBForm = JSON.parse(matrixB)
        console.log("MatrixB: ", matrixBForm)
        let arrayX = Array(matrixAForm.length).fill(0)

        // console.log("MatrixA: ",matrixAForm)
        // console.log("MatrixB: ",matrixBForm)        

        for (let column = 0; column < matrixAForm[0].length; column++) {
            let matrixTemp = JSON.parse(matrixA)

            for (let row = 0; row < matrixAForm.length; row++) {
                matrixTemp[row][column] = matrixBForm[row]
            }

            arrayX[column] = parseFloat(((math.det(math.matrix(matrixTemp))) / (math.det(math.matrix(matrixAForm)))).toFixed(0))
            dataError.push(arrayX[column])
        }

        setMatrixLength(matrixAForm.length)
        setChartData(dataError)
        checkAnswer(matrixA, arrayX)
        setAnswer(JSON.stringify(arrayX))
    }

    function calGuassElimination(matrixA, matrixB) {
        let matrixAForm = JSON.parse(matrixA)
        let matrixBForm = JSON.parse(matrixB)
        let arrayX = Array(matrixAForm.length).fill(0)
        let matrixTemp = []

        for (let row = 0; row < matrixAForm.length; row++) {
            let temp = []
            for (let column = 0; column < matrixAForm[0].length + 1; column++) {
                if (column < matrixAForm.length) {
                    temp.push(matrixAForm[row][column])
                }
                else {
                    temp.push(matrixBForm[row])
                }
            }
            matrixTemp.push(temp)
        }

        for (let i = 0; i < matrixTemp.length; i++) {
            for (let j = i + 1; j < matrixTemp.length; j++) {
                let temp = matrixTemp[j][i] / matrixTemp[i][i]
                console.log("temp: ", temp)
                for (let k = 0; k < matrixTemp.length + 1; k++) {
                    console.log("matrix[", j, "]", "[", k, "]=", matrixTemp[j][k], "-", temp * matrixTemp[i][k])
                    matrixTemp[j][k] = matrixTemp[j][k] - temp * matrixTemp[i][k]
                }
            }
        }

        for (let row = matrixTemp.length - 1; row >= 0; row--) {
            arrayX[row] = matrixTemp[row][matrixTemp.length]
            for (let column = row + 1; column < matrixTemp.length; column++) {
                arrayX[row] -= matrixTemp[row][column] * arrayX[column]
            }
            arrayX[row] = parseFloat((arrayX[row] / matrixTemp[row][row]).toFixed(0))
        }

        checkAnswer(matrixA, arrayX)
        setAnswer(JSON.stringify(arrayX))

    }

    function calGuassJordan(matrixA, matrixB) {
        let matrixAForm = JSON.parse(matrixA)
        let matrixBForm = JSON.parse(matrixB)
        let arrayX = Array(matrixAForm.length).fill(0)
        let matrixTemp = []


        for (let row = 0; row < matrixAForm[0].length; row++) {
            let temp = []
            for (let column = 0; column < matrixAForm.length + 1; column++) {
                if (column < matrixAForm.length) {
                    temp.push(matrixAForm[row][column])
                }
                else {
                    temp.push(matrixBForm[row])
                }
            }
            matrixTemp.push(temp)
        }

        for (let i = 0; i < matrixTemp.length; i++) {
            for (let j = 0; j < matrixTemp.length; j++) {

                if (i !== j) {

                    let temp = matrixTemp[j][i] / matrixTemp[i][i]
                    for (let k = 0; k < matrixTemp.length + 1; k++) {
                        console.log(i, j)
                        matrixTemp[j][k] = matrixTemp[j][k] - temp * matrixTemp[i][k]
                    }
                }

            }

        }

        for (let row = 0; row < matrixTemp.length; row++) {
            arrayX[row] = parseFloat((matrixTemp[row][matrixTemp.length] / matrixTemp[row][row]).toFixed(0))
        }

        checkAnswer(matrixA, arrayX)
        setAnswer(JSON.stringify(arrayX))

    }

    function calJacobi(matrixA, matrixB) {

        let dataError = []
        let dataAnswer = []
        let matrixAForm = JSON.parse(matrixA)
        let matrixBForm = JSON.parse(matrixB)
        let arrayX = Array(matrixAForm.length).fill(0)
        let arrayXnew = Array(matrixAForm.length).fill(0)
        let arrayError = Array(matrixAForm.length).fill(0)
        let divide = 0
        let round = 1
        let check = 0
        let tempX = []

        for (let i = 0; i < matrixAForm.length; i++) {
            tempX[i] = "X" + (i + 1)
        }

        while (round < 100) {
            check = 0
            console.log("Iteration " + round)
            for (let row = 0; row < matrixAForm.length; row++) {
                arrayXnew[row] = matrixBForm[row]
                for (let column = 0; column < matrixAForm[0].length; column++) {

                    if (row === column) {
                        divide = matrixAForm[row][column]
                    }
                    else if (row !== column) {
                        arrayXnew[row] -= (matrixAForm[row][column] * arrayX[column])
                        // console.log(arrayXnew[row])
                    }
                }

                arrayXnew[row] = (arrayXnew[row] / divide).toFixed(6)
                arrayError[row] = math.abs((arrayXnew[row] - arrayX[row]) / arrayXnew[row]).toFixed(6)
            }

            let objAnswer = {
                iteration: round.toString()
            }

            let objError = {
                iteration: round.toString()
            }

            for (let i = 0; i < matrixAForm.length; i++) {
                objAnswer = Object.assign(objAnswer, { ["X" + (i + 1)]: arrayXnew[i] })
                objError = Object.assign(objError, { ["X" + (i + 1)]: arrayError[i] })
            }
            console.log(dataError)
            dataAnswer.push(objAnswer)
            dataError.push(objError)
            
            arrayX = JSON.parse(JSON.stringify(arrayXnew))

            for (let i = 0; i < arrayError.length; i++) {
                if (arrayError[i] < ep) {
                    check++
                }
            }

            if (check === arrayError.length) {
                setMatrixLength(matrixAForm.length)
                setChartData(dataAnswer)
                setChartError(dataError)
                arrayX = arrayX.map(index => Number(index))
                checkAnswer(matrixA, arrayX)
                setAnswer(JSON.stringify(arrayX))
                return
            }
            else {
                check = 0
            }

            round = round + 1
        }



    }

    function calGaussSeidel(matrixA, matrixB) {

        let dataAnswer = []
        let dataError = []
        let matrixAForm = JSON.parse(matrixA)
        let matrixBForm = JSON.parse(matrixB)
        let arrayX = Array(matrixAForm.length).fill(0)
        let arrayXnew = Array(matrixAForm.length).fill(0)
        let arrayError = Array(matrixAForm.length).fill(0)
        let divide = 0
        let round = 1
        let check = 0

        while (round < 1000) {
            check = 0
            console.log("Iteration " + round)
            for (let row = 0; row < matrixAForm.length; row++) {
                arrayXnew[row] = matrixBForm[row]
                for (let column = 0; column < matrixAForm[0].length; column++) {
                    if (row === column) {
                        divide = matrixAForm[row][column]
                    }
                    else if (row !== column) {
                        arrayXnew[row] -= (matrixAForm[row][column] * arrayX[column])
                        // console.log(arrayXnew[row])
                    }
                }
                arrayXnew[row] = (arrayXnew[row] / divide).toFixed(6)
                arrayError[row] = math.abs((arrayXnew[row] - arrayX[row]) / arrayXnew[row]).toFixed(6)
                arrayX[row] = arrayXnew[row]
            }

            arrayX = JSON.parse(JSON.stringify(arrayXnew))

            let objAnswer = {
                iteration: round.toString()
            }

            let objError = {
                iteration: round.toString()
            }

            for (let i = 0; i < matrixAForm.length; i++) {
                objAnswer = Object.assign(objAnswer, { ["X" + (i + 1)]: arrayXnew[i] })
                objError = Object.assign(objError, { ["X" + (i + 1)]: arrayError[i] })
            }

            dataAnswer.push(objAnswer)
            dataError.push(objError)

            for (let i = 0; i < arrayError.length; i++) {
                if (arrayError[i] < 0.000001) {
                    check++
                }
            }

            if (check === arrayError.length) {
                console.log(arrayX)
                setMatrixLength(matrixAForm.length)
                setChartData(dataAnswer)
                setChartError(dataError)
                arrayX = arrayX.map(index => Number(index))
                setAnswer(JSON.stringify(arrayX))
                console.log("Type of arrayX ", typeof (arrayX))
                checkAnswer(matrixA, arrayX)
                break
            }
            else {
                check = 0
            }

            round++
        }
    }

    function calConjugate(matrixA, matrixB) {

        let dataAnswer = []
        let dataError = []
        let matrixAForm = math.matrix(JSON.parse(matrixA))
        let matrixBForm = math.matrix(JSON.parse(matrixB))
        let arrayX = math.zeros(math.size(matrixBForm))
        let matrixRForm = math.subtract(math.multiply(matrixAForm, arrayX), matrixBForm)
        let matrixRnew = math.zeros(math.size(matrixBForm))
        let matrixDForm = math.multiply(matrixRForm, -1)
        let matrixDnew = math.multiply(matrixRForm, -1)
        let arrayXnew = math.zeros(math.size(matrixBForm))
        let arrayError = Array(matrixAForm.length).fill(0)
        let error = 1
        let lambda_k = 0
        let alpha_k = 0
        let count = 1
        let round = 1

        while (round < 20000) {
            console.log("Iteration ", round)

            lambda_k = (math.multiply(math.multiply(matrixDForm, -1), matrixRForm)) / math.multiply(math.transpose(matrixDForm), math.multiply(matrixAForm, matrixDForm))
            arrayXnew = math.add(arrayX, math.multiply(lambda_k, matrixDForm))
            matrixRnew = math.subtract(math.multiply(matrixAForm, arrayXnew), matrixBForm)
            error = (math.sqrt(math.multiply(math.transpose(matrixRnew), matrixRnew))).toFixed(6)


            alpha_k = (math.multiply(math.transpose(matrixRnew), math.multiply(matrixAForm, matrixDForm))) / (math.multiply(math.transpose(matrixDForm), math.multiply(matrixAForm, matrixDForm)))
            matrixDnew = math.add(math.multiply(matrixRnew, -1), math.multiply(alpha_k, matrixDForm))
            // console.log("lambda_k: ", lambda_k)
            // console.log("arrayXnew: ", arrayXnew)
            // console.log("matrixRnew: ", matrixRnew)
            // console.log("error: ", error)
            // console.log("alpha_k: ", alpha_k)
            // console.log("matrixDnew: ", matrixDnew)
            // console.log("------------------")



            if (error < epsilon) {
                console.log("********************************************")
                setMatrixLength(matrixAForm._data.length)
                setChartData(dataAnswer)
                setChartError(dataError)
                arrayXnew = arrayXnew.map(index => Number(index.toFixed(6)))

                console.log("Type of arrayXnew ", typeof (arrayXnew))
                checkAnswer(matrixA, arrayXnew)
                setAnswer(arrayXnew)
                return
            }
            else {
                alpha_k = (math.multiply(math.transpose(matrixRnew), math.multiply(matrixAForm, matrixDForm))) / (math.multiply(math.transpose(matrixDForm), math.multiply(matrixAForm, matrixDForm)))
                matrixDnew = math.add(math.multiply(matrixRnew, -1), math.multiply(alpha_k, matrixDForm))
                matrixDForm = matrixDnew
                arrayX = arrayXnew
            }

            let objAnswer = {
                iteration: round.toString()
            }

            let objError = {
                iteration: round.toString()
            }

            for (let i = 0; i < matrixAForm._data.length; i++) {

                objAnswer = Object.assign(objAnswer, { ["X" + (i + 1)]: arrayX._data[i] })
            }

            objError = Object.assign(objError, { X1: error })



            // objError = Object.assign(objAnswer, { ["X" + (i + 1)]: arrayX[i] })

            setMatrixLength(matrixAForm.length)
            dataAnswer.push(objAnswer)
            dataError.push(objError)

            round = round + 1
        }

    }

    const showMatrix = (matrix) => {
        console.log(matrix)
        try {
            return (
                <MathJax dynamic inline>
                    {"\\(" +
                        math.parse(matrix.toString().replace(/\*/g, "")).toTex({
                            parenthesis: "keep",
                            implicit: "show",
                        }) +
                        "\\)"}
                </MathJax>
            );
        } catch (e) {
            return <MathJax dynamic>{e.toString()}</MathJax>;
        }
    };

    const showChart = (length) => {
        console.log("Lenght of Matrix is ", length)
        var chartLine = [];

        var colorLine = ["#FF3333", "#FF33FC", "#8D33FF", "#333CFF", "#33E0FF", "33FF3C"]
        for (let i = 1; i <= length; i++) {
            chartLine.push(<Line type="monotone" dataKey={"X" + i} stroke={colorLine[i]} strokeWidth={5} />)
        }

        return chartLine
    }

    const inputMatrixA = (matrixSize) => {

        var matrixBoxA = [];

        for (let row = 0; row < matrixSize.rows; row++) {
            for (let column = 0; column < matrixSize.columns; column++) {
                // matrixBoxA.push(<input id={row + "" + column} type="text" onChange={handleMatrixAInput} disabled={disableInput} />)
                matrixBoxA.push(<TextField
                type='number'
                onChange={handleMatrixAInput}
                id={row+ "" +column}
                variant="outlined"
                disabled={disableInput}
                placeholder={"["+row+"]["+column+"]"}
                style={{width:'100px',height:'50px',padding:'10px'}}/>)
            }
            matrixBoxA.push(<br />)
        }

        return matrixBoxA
    }

    const inputMatrixB = (matrixSize) => {

        var matrixBoxB = [];

        for (let row = 0; row < matrixSize.rows; row++) {
            // matrixBoxB.push(<input id={row} type="text" onChange={handleMatrixBInput} disabled={disableInput} />)
            matrixBoxB.push(<TextField
                type='number'
                onChange={handleMatrixBInput}
                id={row}
                variant="outlined"
                disabled={disableInput}
                placeholder={"["+row+"]"}
                style={{width:'100px',height:'50px',padding:'10px'}}/>)
            matrixBoxB.push(<br />)
        }

        return matrixBoxB
    }

    const clearMatrix = () => {
        let arrayA = []
        let arrayB = []

        for (let rows = 0; rows < parseInt(matrixSize.rows); rows++) {
            arrayA.push(new Array(parseInt(matrixSize.columns)).fill(0))
        }

        arrayB = Object.assign(arrayB, Array(parseInt(matrixSize.rows)).fill(0))


        for (let rows = 0; rows < parseInt(matrixSize.rows); rows++) {
            for (let columns = 0; columns < parseInt(matrixSize.columns); columns++) {
                document.getElementById(rows + "" + columns).value = 0;
            }
        }

        for (let rows = 0; rows < parseInt(matrixSize.rows); rows++) {

            document.getElementById(rows).value = 0;

        }

        setMatrixA(JSON.stringify(arrayA))
        setMatrixB(JSON.stringify(arrayB))
    }

    const checkMatrixTranspose = (matrix) => {

        let matrixTemp = math.matrix(JSON.parse(matrix))
        let matrixTranspose = JSON.parse(JSON.stringify(math.transpose(matrixTemp)))

        let matrixATemp = JSON.parse(JSON.stringify(matrixTemp))
        console.log("matrixATemp is ", matrixATemp)
        console.log("matrixATemp Lenght ", matrixATemp.data.length)
        for (let rows = 0; rows < matrixATemp.data.length; rows++) {
            for (let columns = 0; columns < matrixATemp.data[0].length; columns++) {
                if (matrixATemp.data[rows][columns] !== matrixTranspose.data[rows][columns]) {
                    console.log("non-sym")
                    return false
                }
            }
        }

        return true

    }

    const checkAnswer = (matrixA, answer) => {

        console.log("A ", matrixA)
        console.log("B ", answer)
        answer = math.matrix(answer)
        console.log("Type of MatrixA is ", typeof (matrixA))
        console.log("Type of MatrixAnswer is ", typeof (answer))
        console.log("Type of answerForm is ", typeof (answerForm))
        let matrixAForm = math.matrix(JSON.parse(matrixA))
        let matrixAnswerForm = math.matrix(JSON.parse(answer))

        let matrixProveAX = math.multiply(matrixAForm, matrixAnswerForm)
        matrixProveAX = matrixProveAX.map(index => Number(index.toFixed(0)))
        setMatrixProve(matrixProveAX)
        console.log("matrixProve", matrixProve)
        return

    }
    
    return (

        <div className='entire_page'>

            <div className='super_header'>

                <h1>
                    This is Linear Algebra
                </h1>
                <div className='select-method-div'>
                    <FormControl sx={{ m: 1, minWidth: 500 }}>
                        <InputLabel id="method-select-label"> Method </InputLabel>
                        <Select
                            labelId="methodOption"
                            id="method-select"
                            value={method}
                            label="method"
                            onChange={handleMethod}
                        >
                            {methodOption.map((option) =>
                                <MenuItem value={option.value}> {option.label} </MenuItem>)}
                        </Select>
                    </FormControl>
                </div>


                {/* <label>Method:</label>
                <select onChange={handleMethod}>
                    <option value='none' >Select Method for Solving Equation</option>
                    {methodOption.map(options => <option key={options.value}>{options.label}</option>)}
                    {methodOption.map((options) => <option key={options.value} value={options.value}>{options.label}</option>)}

                </select>   */}

                <br />
                <div className='select-problem-div'>
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
                                    <MathJaxContext> MatrixA: {showMatrix(item.matrixA)}  MatrixB: {showMatrix(item.matrixB)}</MathJaxContext>
                                </MenuItem>) : null}
                        </Select>
                    </FormControl>
                </div>


                {/* <label>Problem:</label>
                <select onChange={handleProblem}>
                    <option defaultValue={"none"} value="none" >Select Equation</option>
                    <option value="Custom">Custom</option>
                    {apiProblem ? apiProblem.map(item => <option key={item.id} >{item.id}</option>) : null}

                </select> */}

            </div>

            <br />

            <form className='form' onSubmit={handleSubmit}>

                <div className='input-div'>

                    {/* <p>Example input [A]: [[5, 2, 0, 0],[2,  5, 2, 0],[0, 2, 5, 2],[0, 0, 2, 5]] </p>

                    <p>Example input [B]: [12, 17, 14, 7] </p> */}

                    <div className='input-size'>
                        <label>Input Matrix Size</label>

                        <br />
                        {/* <label>row:</label>
                        <input type='number'
                            onChange={(e) => setMatrixSize({ ...matrixSize, rows: e.target.value })}
                            disabled={disableInput}
                        /> */}
                        <div className='input-rows-size'>
                            <TextField
                                label='Row'
                                type='text'
                                onChange={((event) => setMatrixSize({ ...matrixSize, rows: event.target.value }))}
                                id='row'
                                variant="outlined"
                                disabled={disableInput}
                                placeholder='Row of Matrix'
                            />
                        </div>


                        {/* <label>column:</label>
                        <input type='number'
                            onChange={(e) => setMatrixSize({ ...matrixSize, columns: e.target.value })}
                            disabled={disableInput}
                        /> */}
                        <div className='input-columns-size'>

                            <TextField
                                label='Column'
                                type='text'
                                onChange={((event) => setMatrixSize({ ...matrixSize, columns: event.target.value }))}
                                id='column'
                                variant="outlined"
                                disabled={disableInput}
                                placeholder='Column of Matrix'
                            />
                        </div>
                    </div>
                    <div className='input-matrix'>
                        <div className='input-matrixA'>
                            <label>MatrixA</label>
                            <div>
                                {inputMatrixA(matrixSize)}
                            </div>

                        </div>

                        <div className='input-matrixB'>
                            <label>MatrixB</label>
                            <div>
                                {inputMatrixB(matrixSize)}
                            </div>
                        </div>


                        <br />


                    </div>

                    <div className='button-submit'>

                        <div className='button-submit'>
                            {/* <input name='submit-button' type="submit" value="Submit" /> */}
                            <Button variant="contained" type='submit' value='Submit' > Submit </Button>
                        </div>

                    </div>



                </div>

            </form>
            <div className='button-div'>


                <div className='button-clear'>
                    {/* <button onClick={clearMatrix} disabled={matrixSize.rows < 2 || matrixSize.columns < 2}>Clear Matrix</button> */}
                    <Button variant="contained" onClick={clearMatrix} disabled={matrixSize.rows < 2 || matrixSize.columns <2 } > Clear Matrix </Button>
                </div>

            </div>

            <div className='content' style={{ textAlign: 'center' }}>

                <div className='matrixA-div'>
                    <h2> MatrixA is </h2>
                    <MathJaxContext>
                        {showMatrix(matrixA)}
                        {/* <MathJax dynamic>{"\\(" +parse(matrixA.toString().replace(/\r/g, "")).toTex({parenthesis: "keep",implicit: "show",})+ "\\)"}</MathJax> */}
                    </MathJaxContext>
                </div>

                <div className='matrixB-div'>
                    <h2> MatrixB is </h2>
                    <MathJaxContext>
                        {showMatrix(matrixB)}
                        {/* <MathJax dynamic>{"\\(" +math.parse(matrixB.toString().replace(/\r/g, "")).toTex({parenthesis: "keep",implicit: "show",})+ "\\)"}</MathJax> */}
                    </MathJaxContext>
                </div>



                <div className='answer-div'>
                    <h2> Answer is </h2>
                    <MathJaxContext>
                        <MathJax dynamic>{"\\(" + math.parse(answer.toString().replace(/\r/g, "")).toTex({ parenthesis: "keep", implicit: "show", }) + "\\)"}</MathJax>
                    </MathJaxContext>
                </div>

                <div className='prove-answer'>
                    <h2> Prove Answer is Answer*MatrixB = </h2>
                    <MathJaxContext>
                        {showMatrix(matrixProve)}
                    </MathJaxContext>
                </div>

            </div>

            <div className='chart'>
                <div className='answer-chart'>
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
                        {showChart(matrixLenght)}
                        {/* <Line type="monotone" dataKey={chartData} stroke="#82ca9d" strokeWidth={5} /> */}
                    </LineChart>
                </div>

                <div className='error-chart'>
                    <LineChart
                        width={1000}
                        height={600}
                        data={chartError}
                        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    >
                        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                        <XAxis />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {showChart(matrixLenght)}
                        {/* <Line type="monotone" dataKey={chartData} stroke="#82ca9d" strokeWidth={5} /> */}
                    </LineChart>
                </div>
            </div>



            {/* <SyntaxHighlighter className="code" language="javascript" style={xonokai} showLineNumbers='true' >
                {codeString+codeString2}
            </SyntaxHighlighter>         */}

        </div>

    )
}

export default LinearAlgebra;
