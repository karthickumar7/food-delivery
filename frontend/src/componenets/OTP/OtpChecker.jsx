import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { API_BASE_URL, readJsonResponse } from '../../config/api'
import "./OtpChecker.css"

const OTP_DIGIT = 4;

const OtpChecker = ({ setUser }) => {

    const navigate = useNavigate()

    const inputref = useRef([])

    const phoneNumber = sessionStorage.getItem('otpPhoneNumber')

    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const [inputArr, SetinputArr] = useState(
        new Array(OTP_DIGIT).fill("")
    )

    const handleChange = (value, index) => {

        if (isNaN(value)) return;

        const newArr = [...inputArr]

        const newValue = value.trim()

        newArr[index] = newValue.slice(-1)

        SetinputArr(newArr)

        setMessage('')

        if (value.trim()) {
            inputref.current[index + 1]?.focus()
        }
    }

    const handleKeydown = (e, index) => {

        if (e.key === "Backspace") {

            e.preventDefault()

            const newArr = [...inputArr]

            newArr[index] = ""

            SetinputArr(newArr)

            setMessage('')

            inputref.current[index - 1]?.focus()
        }
    }

    const handleVerifyOtp = async () => {

        const otp = inputArr.join('')

        if (otp.length !== OTP_DIGIT) {

            setMessage('Enter complete OTP')

            return
        }

        try {

            setLoading(true)

            const response = await fetch(
                `${API_BASE_URL}/otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        phone: phoneNumber,
                        otp
                    })
                }
            )

            const data = await readJsonResponse(response)

            if (data.success) {

                // Set user in state and local storage if backend returns user info
                if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                    setUser(data.user);
                }

                // clear stored phone number
                sessionStorage.removeItem('otpPhoneNumber')
                // clear inputs
                SetinputArr(
                    new Array(OTP_DIGIT).fill("")
                )

                setMessage('OTP Verified Successfully')

                setTimeout(() => {
                    navigate('/')
                }, 1500)

            } else {

                setMessage(data.message || 'Invalid OTP')
            }

        } catch (error) {

            setMessage('Server Error')

        } finally {

            setLoading(false)
        }
    }

    useEffect(() => {

        inputref.current[0]?.focus()

    }, [])

    if (!/^\d{10}$/.test(phoneNumber || '')) {

        return <Navigate to="/phonenumber" replace />
    }

    return (

        <div className='otp-page'>

            <h1 className='otp-title'>
                Validate OTP
            </h1>

            <p className="otp-phone">
                OTP sent to {phoneNumber}
            </p>

            <div className='otp-container'>

                {
                    inputArr.map((input, index) => {

                        return (

                            <input
                                type="text"
                                className="otp-input"
                                value={input}
                                key={index}
                                maxLength="1"
                                inputMode="numeric"
                                onKeyDown={(e) =>
                                    handleKeydown(e, index)
                                }
                                ref={(input) =>
                                    (inputref.current[index] = input)
                                }
                                onChange={(e) =>
                                    handleChange(
                                        e.target.value,
                                        index
                                    )
                                }
                                onClick={(e) =>
                                    e.target.setSelectionRange(1, 1)
                                }
                            />
                        )
                    })
                }

            </div>

            {
                message && (
                    <p className="otp-message">
                        {message}
                    </p>
                )
            }

            <button
                type="button"
                className="otp-verify-button"
                onClick={handleVerifyOtp}
                disabled={loading}
            >
                {
                    loading
                        ? "Verifying..."
                        : "Verify OTP"
                }
            </button>

        </div>
    )
}

export default OtpChecker
