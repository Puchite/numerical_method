import React from 'react'
import { Link } from 'react-router-dom'

function RootEquation() {
    return (
        <div>
            
            <Link to="./bisection" ><button type='button' class='btn btn-primary' className='bt_bisection'>Bisection Method</button></Link>
            <Link to="./false_position" ><button type='button' class='btn btn-primary' className='bt_false_position'>False-Position Method</button></Link>
            <Link to="./one_point_iteration" ><button type='button' class='btn btn-primary' className='bt_one_point'>One-Point Iteeration Method</button></Link>
            <Link to="./newton_raphson" ><button type='button' class='btn btn-primary' className='bt_newton_raphson'>Newton-Raphson Method</button></Link>
            <Link to="./secant" ><button type='button' class='btn btn-primary' className='bt_secant'>Secant Method</button></Link>

        </div>
    )
}

export default RootEquation
