import React from 'react';
import { MathComponent } from 'mathjax-react'
import { derivative } from 'mathjs'

let epsilon = 0.000001
let q1 = "7-Math.pow(x,2)"
let q2 = "7-x^2"
let s1 = 2

function calFunction(x,q){
  // eslint-disable-next-line no-eval
  return eval(q)
}
//2-(1/ Math.pow(2.71827,(-x/4)))

function calNewton(q, start){

  let x_old = start
  let x_new = 0
  let c = 1

  while(c>epsilon){  

      console.log(derivative(q2, 'x').toString())
      let x_temp = -calFunction(x_old, q)/calFunction(x_old, derivative(q2, 'x').toString())
      x_new = x_old + x_temp

      c = Math.abs((x_new-x_old)/x_new)

      if(c === Infinity){
        return x_old
      }

      else{
        x_old = x_new
      }
      
  }

  return x_new

}

function NewtonRaphson() {

  return (

    <div className='entire_page'>
            
      <div className='super_header'>
          <h1>
              This is Newton Raphson Method
          </h1>

          <h3> Problem : <MathComponent tex={String.raw`x_{i+1} = 7-x_{i}^2`}/> start at 2 </h3>
          <p>answer is {calNewton(q1,s1)}</p>
          <br/>

      </div>
    
    </div>
  )
}

export default NewtonRaphson;
