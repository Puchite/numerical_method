import React from 'react'
import {Link} from 'react-router-dom'
import Bisection from '../Course/Bisection'

function Course() {
    return (
        <div className='course'>
            <h1>Course</h1> 
                <h2>Root of Equation
                    <Link to="/bisection" ><button>Bisection</button></Link>
                    <Link to="/false-position" ><button>False-Position</button></Link>
                </h2>    
        </div>
    )
}

export default Course
