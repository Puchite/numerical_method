import React, { useState } from 'react';
import { MathComponent } from 'mathjax-react';
import { abs, column, divide, matrix, parse, row } from 'mathjs';

let ep = 0.0001;

function Jacobi() {

  const [ matrixA, setMatrixA] = useState(null)
  const [ matrixB, setMatrixB] = useState(null)
  const [ problem, setProblem ] = useState(null)
  const [ answer, setAnswer] = useState(null)

  const handleSubmit = () => {
    
    calJacobi(matrixA, matrixB)
  }
  
  const handleMatrixAInput = (e) => {
    setMatrixA(e.target.value)
  }

  const handleMatrixBInput = (e) => {
    setMatrixB(e.target.value)
  }
  
  function calJacobi(matrixA, matrixB){
    let matrixAForm = JSON.parse(matrixA)
    let matrixBForm = JSON.parse(matrixB)
    let arrayX = Array(matrixAForm.length).fill(0)
    let arrayXnew = Array(matrixAForm.length).fill(0)
    let arrayError = Array(matrixAForm.length).fill(0)
    let divide = 0
    console.log("MatrixA: "+matrixAForm)
    console.log("MatrixB: "+matrixBForm)
    console.log("Array X: "+arrayX)
    let round = 0
    let check = 0
    while(true)
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
        arrayError[row] = abs((arrayXnew[row]-arrayX[row])/arrayXnew[row])        
      }
      
      round++
      arrayX = JSON.parse(JSON.stringify(arrayXnew))

      // console.log("Before replace Array X: "+arrayX)
      // // for(let i = 0; i < arrayX.length; i++)
      // // {
      // //   arrayX[i]  =  arrayXnew[i]
      // // }
      // console.log("After replace Array X: "+arrayX)
      
      for(let i = 0; i < arrayError.length; i++)
      {
        if(arrayError[i]<ep)
        {
          check++
        }
      }
      console.log(arrayError.length)

      if(check===arrayError.length)
      {
        setAnswer(JSON.stringify(arrayX))
        break
      }
    }
  }

  return(

    <div className='entire_page'>
            
      <div className='super_header'>

          <h1>
              This is Jacobi Iteration Method
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

export default Jacobi;
