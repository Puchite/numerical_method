import React from 'react'
import {Link} from 'react-router-dom'
import './Course.css'

function Course() {
    return (
        <div className='entire_page'>
            
            <div className='super_header'>
                    <h1 className='course_header'>
                        Course
                    </h1>
            </div>

            <div className='row-course'>
                

                <div className='bg-rooteq'>

                    <div className='rooteq-couse'>
                        <h2>    
                            Root of Equation
                        </h2>
                        <p>
                            This is Root of Equation Course 
                        </p>
                        <Link to="./root_of_equation" ><button type='button' class='btn btn-primary' className='bt_root_of_equation'>View Root Of Equation Content</button></Link>
                        {/* <Link to="./bisection" ><button type='button' class='btn btn-primary' className='bt_bisection'>Bisection Method</button></Link>
                        <Link to="./false_position" ><button type='button' class='btn btn-primary' className='bt_false_position'>False-Position Method</button></Link>
                        <Link to="./one_point_iteration" ><button type='button' class='btn btn-primary' className='bt_one_point'>One-Point Iteeration Method</button></Link>
                        <Link to="./newton_raphson" ><button type='button' class='btn btn-primary' className='bt_newton_raphson'>Newton-Raphson Method</button></Link>
                        <Link to="./secant" ><button type='button' class='btn btn-primary' className='bt_secant'>Secant Method</button></Link> */}
                     
                    </div>

                </div>
                <div className='bg-2'>

                    <div className='2-couse'>
                        <h2>    
                            Coming soon
                        </h2>
                        <p>
                            Course 2 
                        </p>                        
                     
                    </div>

                </div>
                <div className='bg-3'>

                    <div className='3-couse'>
                        <h2>    
                            Coming soon
                        </h2>
                        <p>
                            Course 3 
                        </p>                        
                     
                    </div>

                </div>                
                


            </div>
                

                
        </div>
        
        
    )
}

export default Course
