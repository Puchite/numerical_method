import React, { useState } from 'react';
import { MathComponent } from 'mathjax-react';
import * as math from 'mathjs';

let ep = 0.0001;

function Conjugate() {

  const [ matrixA, setMatrixA] = useState(0)
  const [ matrixB, setMatrixB] = useState(0)
  const [ problem, setProblem ] = useState(null)
  const [ answer, setAnswer] = useState(null)

  const handleSubmit = () => {
    
    try {
        setAnswer(calConjugate(matrixA, matrixB))
    } catch (error) {
        setAnswer("Invalid Matrix") 
    }
    
  }
  
  const handleMatrixAInput = (e) => {
    setMatrixA(e.target.value)
  }

  const handleMatrixBInput = (e) => {
    setMatrixB(e.target.value)
  }
  
  function calConjugate(matrixA, matrixB){

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
            return arrayXnew
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

  return(

    <div className='entire_page'>
            
      <div className='super_header'>

          <h1>
              This is Conjugate Iteration Method
          </h1>
          <p>Example input [A]: [[5, 2, 0, 0],[2,  5, 2, 0],[0, 2, 5, 2],[0, 0, 2, 5]] </p>
          <p>Example input [B]: [12, 17, 14, 7] </p>
          <form className='form' onSubmit={handleSubmit}>
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

            <h3> Problem : <MathComponent tex={String(answer)}/></h3>

      </div>
    
    </div>
  );
}

export default Conjugate;
