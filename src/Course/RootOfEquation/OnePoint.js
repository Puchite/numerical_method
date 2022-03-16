import React, { useState } from 'react';
import { MathComponent } from 'mathjax-react'



let q1 = "(1/2)-x"
let s1 = 0
let q2 = "-Math.pow(e,x/4)+2"
let s2 = 0
let q3 = "-Math.pow(e,x/4)+2"
let s3 = 6
let e = 2.718289
let epsilon = 0.000001

function calFunction(x,q){
  // eslint-disable-next-line no-eval
  return eval(q)
}

function calOnePoint(q, start){

  let x_old = start
  let x_new = 0
  let c = 1

  while(c>epsilon){  

      x_new = calFunction(x_old,q)
    
      c = Math.abs((x_new-x_old)/x_new)
      console.log("Error is: "+c)
      
      if(c === Infinity){
        return x_old
      }

      else{
        x_old = x_new
      }
      
  }

  return x_new

}

function OnePoint() {
  
  return(

    <div className='entire_page'>
            
      <div className='super_header'>

          <h1>
              This is One Point Iteration Method
          </h1>

          <h3> Problem : <MathComponent tex={String.raw`x_{i+1} = (1/2)-x_i`}/> start at 0 </h3>
          <p>answer is {calOnePoint(q1,s1).toFixed(6)}</p>
          <br/>

          <h3> Problem : <MathComponent tex={String.raw`x_{i+1} = -e^{x_{i}\over 4}+2`}/> start at 0 {s2} </h3>
          <p>answer is {calOnePoint(q2,s2).toFixed(6)}</p>
          <br/>

          <h3> Problem : <MathComponent tex={String.raw`x_{i+1} = -e^{x_{i}\over 4}+2`}/> start at 6 {s2} </h3>
          <p>answer is {calOnePoint(q3,s3).toFixed(6)}</p>
          <br/>

      </div>
    
    </div>
  );
}

export default OnePoint;
