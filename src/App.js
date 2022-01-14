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
          <Route path="/" exact element={<Home />} />
          <Route path='/course' element={<Course />} />
          <Route path='/about' element={<About />} />
          <Route path='/bisection' element={<Bisection />} />
          <Route component={Error} > </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;