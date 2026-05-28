import React from 'react'
import "./Notfound.css"
import { Link, useNavigate } from 'react-router-dom'

const Notfound = () => {
    const navigate=useNavigate()
  return (
    <div className="notfound">

      <h1>404</h1>

      <h2>Page Not Available</h2>

      <p>
        Sorry, the page you are looking for does not exist.
      </p>

      <button  className='home-btn' onClick={()=>navigate("/",{replace:true})}>Go Back home</button>

    </div>
  )
}

export default Notfound