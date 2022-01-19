import React, {Component} from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Course from './pages/Course';
import About from './pages/About';
import RootEquation from './Course/RootOfEquation/RootEquation';
import Bisection from './Course/RootOfEquation/Bisection';
import FalsePosition from './Course/RootOfEquation/FalsePosition';


function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path='/course' element={<Course />} />
          <Route path='/about' element={<About />} />
          <Route path='course/root_of_equation' element={<RootEquation />} />
          <Route path='course/root_of_equation/bisection' element={<Bisection />} />
          <Route path='course/root_of_equation/false_position' element={<FalsePosition />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;