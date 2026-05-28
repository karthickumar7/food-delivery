import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './PhoneNumber.css'

const PhoneNumber = () => {

  const navigate = useNavigate()

  const [phoneNumber, setPhoneNumber] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {

    const digitsOnly = event.target.value
      .replace(/\D/g, '')
      .slice(0, 10)

    setPhoneNumber(digitsOnly)

    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (event) => {

    event.preventDefault()

    if (!/^\d{10}$/.test(phoneNumber)) {

      setError('Enter a valid 10 digit phone number')

      return
    }

    try {

      setLoading(true)

      const response = await fetch('http://localhost:3000/phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: phoneNumber
        })
      })

      const data = await response.json()

      if (data.success) {

        sessionStorage.setItem(
          'otpPhoneNumber',
          phoneNumber
        )

        navigate('/otp')

      } else {

        setError(data.message || 'Failed to send OTP')
      }

    } catch (error) {

      setError('Server error')

    } finally {

      setLoading(false)
    }
  }

  return (
    <main className="phone-page">

      <form
        className="phone-card"
        onSubmit={handleSubmit}
      >

        <h1>Enter Phone Number</h1>

        <div className="phone-field">

          <label htmlFor="phoneNumber">
            Phone number
          </label>

          <input
            id="phoneNumber"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength="10"
            placeholder="9876543210"
            value={phoneNumber}
            onChange={handleChange}
          />

        </div>

        {error && (
          <p className="phone-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Continue'}
        </button>

      </form>

    </main>
  )
}

export default PhoneNumber