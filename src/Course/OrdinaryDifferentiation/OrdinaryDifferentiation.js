import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { Button } from '@mui/material'

var token;
const login = async () => {
    await axios.post('http://localhost:3001/login', {
        email: "s6204062616316@email.kmutnb.ac.th",
        password: "0859150757"
    }).then((res) => {
        token = res.data
        console.log("Token is ", token)
    })
}

function OrdinaryDifferentiation() {
    return (

        
        <div className='entire_page'>
            <div className='super_header'>
                <h2>
                    This is Ordinary Differentiation
                </h2>
            </div>

        </div>
        
    )
}

export default OrdinaryDifferentiation