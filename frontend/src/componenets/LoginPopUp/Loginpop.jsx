import React, { useState } from 'react'
import "./LoginPop.css"
import { assets } from '../../assets/assets'
import { API_BASE_URL, readJsonResponse } from '../../config/api'

const Loginpop = ({SetshowLogin, setUser = () => {}}) => {
    const [currentstate,SetcurrentState]=useState("login")
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        dob: "",
        city: "",
        address: "",
        phoneNumber: "",
    })
    const [message, setMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setMessage("")
        setIsSubmitting(true)

        const endpoint = currentstate === "login" ? "/api/users/login" : "/api/users/signup"
        const body = currentstate === "login"
            ? { email: formData.email, password: formData.password }
            : formData

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            })
            const data = await readJsonResponse(response)

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong")
            }

            localStorage.setItem("user", JSON.stringify(data.user))
            if (typeof setUser === "function") {
                setUser(data.user)
            }
            SetshowLogin(false)
        } catch (error) {
            setMessage(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

  return (
    <div className='login-popup'>
        <form  className="login-popup-container"
        onSubmit={handleSubmit}>
            <div className="login-popup-title">
                <h2>{currentstate==="login"?"Login":"Sign Up"}</h2>
                <img src={assets.cross_icon} 
                  alt="Close"
                onClick={()=>SetshowLogin(false)}/>
            </div>
            <div className="login-popup-input">
                  {
                        currentstate !== "login" &&
                        (
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        )
                    }
                <input type="email" name="email" placeholder='Your email' value={formData.email} onChange={handleChange} required/>
                <input type="password" name="password" placeholder='Password ' value={formData.password} onChange={handleChange} required />
                {
                    currentstate !== "login" &&
                    (
                        <>
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                            <input type="text" name="city" placeholder='City' value={formData.city} onChange={handleChange} required />
                            <input type="text" name="address" placeholder='Address' value={formData.address} onChange={handleChange} required />
                            <input type="tel" name="phoneNumber" placeholder='Phone number' value={formData.phoneNumber} onChange={handleChange} required />
                        </>
                    )
                }
                
            </div>
            {message && <p className="login-popup-message">{message}</p>}
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Please wait..." : currentstate==="login" ? "Login" : "Create Account"}
            </button>
            <div className="login-popup-condition">
                <input type="checkbox" required/>
                <p>By Continuing,I agree to terms and conditions</p>
            </div>
            <div className="signInorLogin">
                <h4>
                        {
                            currentstate === "login"
                            ? "Don't have an account?"
                            : "Already have an account?"
                        }
                    </h4>
                     <span
                        onClick={() =>
                            SetcurrentState(
                                currentstate === "login"
                                ? "signin"
                                : "login"
                            )
                        }
                    > {
                            currentstate === "login"
                            ? " Sign Up"
                            : " Login"
                        }
                    </span>
            </div>

        </form>
    </div>
  )
}

export default Loginpop
