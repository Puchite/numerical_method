import React from 'react';
import './App.css';
import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import Course from './pages/Course';
import RootEquation from './Course/RootOfEquation/RootEquation';
import Bisection from './Course/RootOfEquation/Bisection';
import FalsePosition from './Course/RootOfEquation/FalsePosition';
import OnePoint from './Course/RootOfEquation/OnePoint';
import NewtonRaphson from './Course/RootOfEquation/NewtonRaphson';
import LinearAlgebra from './Course/LinearAlgebra/LinearAlgebra' 
import Jacobi from './Course/LinearAlgebra/Jacobi';
import GaussSeidel from './Course/LinearAlgebra/GaussSeidel';
import Conjugate from './Course/LinearAlgebra/Conjugate';
import Polation from './Course/Polation/Polation';

function App() {

  return (

    <>
      <Router>
        <Routes>        
          {/* <Route exact path="/" element={<Home />} /> */}
          <Route exact path='/' element={<Course />} />
          {/* Course of RootEquation */}          
          <Route path='/root_of_equation' element={<RootEquation />} />
          <Route path='/root_of_equation/bisection' element={<Bisection />} />
          <Route path='/root_of_equation/false_position' element={<FalsePosition />} />
          <Route path='/root_of_equation/one_point' element={<OnePoint />} />
          <Route path='/root_of_equation/newton_raphson' element={<NewtonRaphson />} />
          {/* Course of LinearAlgebra */}
          <Route path='/linear_algebra' element={<LinearAlgebra/>} />
          <Route path='/linear_algebra/jacobi' element={<Jacobi/>} />
          <Route path='/linear_algebra/gauss_seidel' element={<GaussSeidel/>} />
          <Route path='/linear_algebra/conjugate' element={<Conjugate/>} />
          {/* Course of Polation */}
          <Route path='/polation' element={<Polation/>} />      

        </Routes>
        
      </Router>
    </>
    
  );
}

export default App;