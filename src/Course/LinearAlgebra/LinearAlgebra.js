import React, { useEffect, useState, useRef } from 'react'
import functionPlot from 'function-plot'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios'
import { parse, derivative, evaluate } from 'mathjs';
import Desmos from 'desmos'
import { Chart } from 'chart.js'
import * as math from 'mathjs'
import  { MathJax, MathJaxContext } from 'better-react-mathjax'
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

let e = Math.E
let epsilon = 0.000001
let ep = 0.0001;
const baseUrl = 'http://localhost:3001/root-equation/'
let elt = document.getElementById('elt')
let calculator = Desmos.GraphingCalculator(elt);  

const methodOption = [
    { value: "crammerRule", label: "Crammer's Rule"},
    { value: "jacobi", label: "Jacobi Method"},
    { value: "gaussSeidel", label: "Gauss Seidel Method"},
    { value: "conjugate", label: "Conjugate Method"},

]


function  LinearAlgebra(){
    // const [ bound, setBound ] = useState({left:'0',right:'0'})
    const [ matrixA, setMatrixA] = useState(0)
    const [ matrixB, setMatrixB] = useState(0)
    const [ matrixLenght, setMatrixLength] = useState(0)
    const [ chartData, setChartData ] = useState([])
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
    const chartDataRef = useRef(chartData)
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
        }

    }, [equation, problem, chartData]);


    const getData = async () => {
        
        await axios.get('http://localhost:3001/linear')
                                   .then((res) =>{
                                        console.log('fetch success data is', res.data)
                                        const response = res.data
                                        setRes(response)
                                        
                                    }, (error) => {
                                        console.log(error)})
        
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
            
            case 'crammerRule':
                setapiProblem(res.crammerRule)
                break

            case "jacobi":         
                setapiProblem(res.jacobi)
                console.log(res.jacobi)
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
        if(e.target.value === 'Custom')
        {
            setDisableinput(false)
            setCustominput(true)
        }
        else
        {
            setMatrixA(apiProblem[e.target.value-1].matrixA)
            setMatrixB(apiProblem[e.target.value-1].matrixB)
            setDisableinput(true)
            setCustominput(false)
        }
        
    }  

    const handleMatrixAInput = (e) => {
        setMatrixA(e.target.value)
    }

    const handleMatrixBInput = (e) => {
        setMatrixB(e.target.value)
    }

    const handleSubmit = () => {
        
        switch(method)
        {
            case 'crammerRule':
                calCrammerRule(matrixA, matrixB)
                break

            case 'jacobi':
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

    function calCrammerRule(matrixA, matrixB){

        let matrixAForm = JSON.parse(matrixA)
        console.log("MatrixA: ",matrixAForm)
        let matrixBForm = JSON.parse(matrixB)
        console.log("MatrixB: ",matrixBForm)
        let arrayX = Array(matrixAForm.length).fill(0)
        
        // console.log("MatrixA: ",matrixAForm)
        // console.log("MatrixB: ",matrixBForm)
    
        
        console.log("MatrixTemp: ",matrixAForm)

        for(let column = 0; column < matrixAForm.length; column++)
        {
            let matrixTemp = JSON.parse(JSON.stringify(matrixAForm))
            console.log("Matrix before replace: ",matrixTemp)
            for(let row = 0; row < matrixAForm[0].length; row++)
            {                
                matrixTemp[row][column] = matrixBForm[row]
            }
            console.log("Matrix after replace: ",matrixTemp)


            arrayX[column] = (math.det(math.matrix(matrixTemp)))/(math.det(math.matrix(matrixAForm)))
            // math.matrix(JSON.parse(matrixA))
            console.log(arrayX)                
        }

        setAnswer(JSON.stringify(arrayX))
    }
    function calJacobi(matrixA, matrixB){

        let dataError = []
        let dataAnswer = []
        let matrixAForm = JSON.parse(matrixA)
        let matrixBForm = JSON.parse(matrixB)
        let arrayX = Array(matrixAForm.length).fill(0)
        setMatrixLength(matrixAForm.length)
        let arrayXnew = Array(matrixAForm.length).fill(0)
        let arrayError = Array(matrixAForm.length).fill(0)
        let divide = 0
        console.log("MatrixA: "+matrixAForm)
        console.log("MatrixB: "+matrixBForm)
        console.log("Array X: "+arrayX)
        let round = 1
        let check = 0
        let tempX = []

        for (let i = 0; i<matrixAForm.length; i++)
        {
            tempX[i] = "X"+(i+1)
        }
        
        while(round<1000)
        {
          check = 0
          console.log("Iteration "+round)
          for (let row = 0; row < matrixAForm[0].length; row++)
          {
            arrayXnew[row] = matrixBForm[row]      
            for (let column = 0; column < matrixAForm.length; column++)
            {          
            
              if(row===column)
              {
                divide = matrixAForm[row][column]                        
              }
              else if(row!==column)
              {
                arrayXnew[row] -= (matrixAForm[row][column]*arrayX[column])
                console.log(arrayXnew)
                // console.log(arrayXnew[row])
              }
            }      

            arrayXnew[row] = arrayXnew[row]/divide      
            arrayError[row] = math.abs((arrayXnew[row]-arrayX[row])/arrayXnew[row])        
          }
        
          
        //   for(let i = 0 ; i<matrixAForm.length; i++)
        //   {
        //     var obj = {}
        //     obj[tempX[i]] = arrayXnew[i]
        //     aa.push(obj)  
        //   }
          let obj = {
              name:round.toString()
          }

          for(let i = 0;i<matrixAForm.length; i++)
          {
              obj = Object.assign(obj, {["X"+(i+1)]:arrayXnew[i]})
          }
          
          dataError.push(obj)
          console.log("1")

          //   for(let i = 0; i<matrixAForm.length; i++)
          //   {
          //       for(let j=0; j<matrixAForm.length; j++)
          //       {
          //         tempArray.push({"X1":arrayXnew[j]})
          //       }

          //   }
         
   
          arrayX = JSON.parse(JSON.stringify(arrayXnew))
          
          for(let i = 0; i < arrayError.length; i++)
          {
            if(arrayError[i]<0.000001)
            {
              check++
            }
          }
    
          if(check===arrayError.length)
          {
            console.log(dataError)
            setChartData(dataError)
            setAnswer(JSON.stringify(arrayX))
            return
          }
          else
          {
            check=0
          }

          round++
        }

        

    }

    function calGaussSeidel(matrixA, matrixB){

        let dataError = []
        let matrixAForm = JSON.parse(matrixA)
        let matrixBForm = JSON.parse(matrixB)
        let arrayX = Array(matrixAForm.length).fill(0)
        let arrayXnew = Array(matrixAForm.length).fill(0)
        let arrayError = Array(matrixAForm.length).fill(0)
        let divide = 0
        let round = 1
        let check = 0

        while(round<1000)
        {
          check = 0
          console.log("Iteration "+round)
          for (let row = 0; row < matrixAForm[0].length; row++)
          {
            arrayXnew[row] = matrixBForm[row]      
            for (let column = 0; column < matrixAForm.length; column++)
            {          
              if(row===column)
              {
                divide = matrixAForm[row][column]                        
              }
              else if(row!==column)
              {
                arrayXnew[row] -= (matrixAForm[row][column]*arrayX[column])
                // console.log(arrayXnew[row])
              }
            }      
            arrayXnew[row] = arrayXnew[row]/divide      
            arrayError[row] = math.abs((arrayXnew[row]-arrayX[row])/arrayXnew[row])
            arrayX[row] = arrayXnew[row]   
          }
          
          console.log("Before replace Array X: "+arrayX)
          arrayX = JSON.parse(JSON.stringify(arrayXnew))
          console.log("After replace Array X: "+arrayX)
          
            let obj = {
                name:round.toString()
            }
        
            for(let i = 0;i<matrixAForm.length; i++)
            {
                obj = Object.assign(obj, {["X"+(i+1)]:arrayXnew[i]})
            }
        
            dataError.push(obj)

          for(let i = 0; i < arrayError.length; i++)
          {
            if(arrayError[i]<0.000001)
            {
              check++
            }
          }
    
          if(check===arrayError.length)
          {
            console.log(arrayX)
            setChartData(dataError)
            setAnswer(JSON.stringify(arrayX))
            break
          }
          else
          {
              check=0
          }

          round++
        }
    }

    function calConjugate(matrixA, matrixB){

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
        console.log("MatrixA: "+matrixAForm)
        console.log("MatrixB: "+matrixBForm)
        console.log("MatrixR: "+matrixRForm)
        console.log("MatrixD: "+matrixDForm)
        console.log("Array X: "+arrayX)
        let count = 1

        while(count<20)
        {
            console.log("Iteration ",count)
            
            lambda_k = (math.multiply(math.multiply(matrixDForm, -1), matrixRForm))/math.multiply(math.transpose(matrixDForm), math.multiply(matrixAForm, matrixDForm))
            arrayXnew = math.add(arrayX, math.multiply(lambda_k, matrixDForm))
            matrixRnew = math.subtract(math.multiply(matrixAForm, arrayXnew), matrixBForm)
            error = math.sqrt(math.multiply(math.transpose(matrixRnew), matrixRnew))
            dataError.push({X1:error})
            // alpha_k = (math.multiply(math.transpose(matrixRnew), math.multiply(matrixAForm,matrixDForm)))/(math.multiply(math.transpose(matrixDForm), math.multiply(matrixAForm, matrixDForm)))
            // matrixDnew = math.add(math.multiply(matrixRnew, -1), math.multiply(alpha_k, matrixDForm))
    
            console.log("lambda_k: ",lambda_k)
            console.log("arrayXnew: ",arrayXnew)
            console.log("matrixRnew: ",matrixRnew)
            console.log("error: ",error)
            console.log("alpha_k: ",alpha_k)
            console.log("matrixDnew: ",matrixDnew)
            console.log("------------------")
    
            if(error<0.000001)
            {
                setChartData(dataError)
                setAnswer(arrayXnew)
                return
            }
            else
            {
                alpha_k = (math.multiply(math.transpose(matrixRnew), math.multiply(matrixAForm,matrixDForm)))/(math.multiply(math.transpose(matrixDForm), math.multiply(matrixAForm, matrixDForm)))
                matrixDnew = math.add(math.multiply(matrixRnew, -1), math.multiply(alpha_k, matrixDForm))
                matrixDForm = matrixDnew
                arrayX = arrayXnew
            }
    
            count++
        }
            
    }

    const showMatrix = (matrix) => {
        try {
          return (
                <MathJax dynamic>
                  {"\\(" +
                    parse(matrix.toString().replace(/\r/g, "")).toTex({
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

    const showChartError = (length) => {
        console.log("Lenght of Matrix is ",length)
        var chartLine = [];
        var colorLine = ["#FF3333", "#FF33FC", "#8D33FF", "#333CFF", "#33E0FF", "33FF3C"]
        for(let i = 1; i<=length; i++)
        {
            console.log(chartData)
            console.log("Set X"+i)
            chartLine.push(<Line type="monotone" dataKey={"X"+i} stroke={colorLine[i]} strokeWidth={5} />)
        }

        console.log(chartLine)
        return chartLine
    }

    return (
            
        <div className='entire_page'>
            
            <div className='super_header'>

                <h1>
                    This is Linear Algebra 
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

                {/* <h3> Problem : <MathComponent tex={String(problem)}/></h3> */}
                {/* <p> answer is {calBisection(a,b).toFixed(6)} </p> */}
                
            </div>

            <br/>
            {/* <div> Problem is : {problem} </div> */}

            <form className='form' onSubmit={handleSubmit}>
                
                <p>Example input [A]: [[5, 2, 0, 0],[2,  5, 2, 0],[0, 2, 5, 2],[0, 0, 2, 5]] </p>
                <p>Example input [B]: [12, 17, 14, 7] </p>
                <label>
                    MatrixA:
                    <input 
                        type="text" 
                        // value={equation} 
                        onChange={handleMatrixAInput} 
                        // disabled={disableInput} 
                        placeholder='Matrix'
                    />
                </label>
                <br/>
                <label>
                    MatrixB:
                    <input 
                        type="text" 
                        // value={equation} 
                        onChange={handleMatrixBInput} 
                        // disabled={disableInput} 
                        placeholder='Matrix'
                    />
                </label>
                <br/>
                <input 
                    type="submit" 
                    value="Submit" 
                />
                    
                </form>

            <br/>
            <div className='content' style={{textAlign: 'center'}}>

                <div className='matrix-div'>
                    <h2> MatrixA is </h2>
                        <MathJaxContext>
                            {showMatrix(matrixA)}                            
                            {/* <MathJax dynamic>{"\\(" +parse(matrixA.toString().replace(/\r/g, "")).toTex({parenthesis: "keep",implicit: "show",})+ "\\)"}</MathJax> */}
                        </MathJaxContext>
                

                    <h2> MatrixB is </h2>
                        <MathJaxContext>
                            {showMatrix(matrixB)} 
                            {/* <MathJax dynamic>{"\\(" +math.parse(matrixB.toString().replace(/\r/g, "")).toTex({parenthesis: "keep",implicit: "show",})+ "\\)"}</MathJax> */}
                        </MathJaxContext>
                </div>

                <div className='answer-div'>
                    <h2> Answer is </h2>
                        <MathJaxContext>
                            <MathJax dynamic>{"\\(" +math.parse(answer.toString().replace(/\r/g, "")).toTex({parenthesis: "keep",implicit: "show",})+ "\\)"}</MathJax>
                        </MathJaxContext>
                </div>
                
            </div>
            
            <div className='chart'>
                <div className='error-chart'>
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
                    {showChartError(matrixLenght)}
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
