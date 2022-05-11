import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import './Course.css'
import axios from 'axios'
import { Button } from '@mui/material'

function Course() {
    return (

        <div className='entire_page'>
            
            {/* <div className='super_header'>
                    <h1 className='course_header'>
                        Course
                    </h1>
            </div> */}

            <div className='row-course'>
                

                <div className='bg-rooteq'>

                    <div className='rooteq-course-div'>

                        <div className='rooteq-course'>

                            <h2 style={{padding:'2rem'}}>    
                                Root of Equation
                            </h2>
                        
                            <p style={{padding:'2rem'}}>
                                This is Root of Equation Course 
                            </p>

                            <Link to="./root_of_equation" ><Button variant="contained" className='bt_root_of_equation' style={{backgroundColor: '#6CBB7A'}} > View Root Of Equation Content </Button></Link>
                            
                        </div>
 
                        
                </div>

                    

                </div>

                <div className='bg-linear'>

                    <div className='linear-course'>
                        <h2 style={{padding:'2rem'}}>    
                            Linear Algebra
                        </h2>
                        
                        <p style={{padding:'2rem'}}>
                            This is Linear Algebra Course 
                        </p>
                        
                        <Link to="./linear_algebra" ><Button variant="contained" className='bt_root_of_equation' style={{backgroundColor: '#6CBB7A'}} > View Linear Algebra Content </Button></Link>
                        
                    </div>

                </div>

                <div className='bg-polation'>

                    <div className='polation-course'>
                        
                        <h2 style={{padding:'2rem'}}>    
                            Polation
                        </h2>
                        
                        <p style={{padding:'2rem'}}>
                            This is Polation Course
                        </p>
                        
                        <Link to="./polation" ><Button variant="contained" className='bt_root_of_equation' style={{backgroundColor: '#6CBB7A'}} > View Polation Content </Button></Link>
                     
                    </div>

                </div>        

                <div className='bg-linearRegression'>

                    <div className='linearRegression-course'>
                        
                        <h2 style={{padding:'2rem'}}>    
                            Linear Regression
                        </h2>
                        
                        <p style={{padding:'2rem'}}>
                            This is Linear Regression
                        </p>
                        
                        <Link to="./linearRegression" ><Button variant="contained" className='bt_root_of_equation' style={{backgroundColor: '#6CBB7A'}} > View Linear Regression Content </Button></Link>
                     
                    </div>

                </div>           

                <div className='bg-numericalDifferentiation'>

                    <div className='numericalDifferentiation-course'>
                        
                        <h2 style={{padding:'2rem'}}>    
                            Linear Regression
                        </h2>
                        
                        <p style={{padding:'2rem'}}>
                            This is Linear Regression
                        </p>
                        
                        <Link to="./numericalDifferentiation" ><Button variant="contained" className='bt_root_of_equation' style={{backgroundColor: '#6CBB7A'}} > View Numerical Differentiation Content </Button></Link>
                     
                    </div>

                </div>           
                


            </div>
                

                
        </div>
        
        
    )
}

export default Course
