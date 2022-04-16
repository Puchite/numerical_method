import React from 'react';
import './App.css';
import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import Course from './pages/Course';
import RootEquation from './Course/RootOfEquation/RootEquation';
import LinearAlgebra from './Course/LinearAlgebra/LinearAlgebra' 
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
          {/* Course of LinearAlgebra */}
          <Route path='/linear_algebra' element={<LinearAlgebra/>} />
          {/* Course of Polation */}
          <Route path='/polation' element={<Polation/>} />      

        </Routes>
        
      </Router>
    </>
    
  );
}

export default App;