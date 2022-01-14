import React, {Component} from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Course from './pages/Course';
import About from './pages/About';
import Bisection from './Course/Bisection';


function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path='/course' element={<Course />} />
          <Route exact path='/about' element={<About />} />
          <Route exact path='/bisection' element={<Bisection />} />
          <Route element={Error} > </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;