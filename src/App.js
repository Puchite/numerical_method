// import React from 'react';
import React, { useEffect, useState, useRef } from 'react'
import './App.css';
import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import Course from './pages/Course';
import RootEquation from './Course/RootOfEquation/RootEquation';
import LinearAlgebra from './Course/LinearAlgebra/LinearAlgebra' 
import Polation from './Course/Polation/Polation';
import Navbar from './components/Navbar'
import axios from 'axios'

function App() {

  // const [ token, setToken ] = useState('')
  // const isfirstRender = useRef(true)
  // const tokenRef = useRef(token)

  // const login = async () =>  {
  //   await axios.post('http://localhost:3001/login',{
  //     email: "s6204062616316@email.kmutnb.ac.th",
  //     password: "0859150757"
  //   }).then((res) => {
  //     const response = res.data
  //     setToken(response)
  //     console.log(response)
  //     console.log("token is ",token)
  //   })
  // }

  // useEffect(() => {
  //   if(isfirstRender.current)
  //   {
  //     login()
  //     isfirstRender.current = false
  //   }
  //   else
  //   {
  //     tokenRef.current = token
      
  //   }
  // })
  
  
  return (
    
    
    <>
      
      <Router>
      <Navbar/>
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