import React, { useContext, useState } from 'react'
import "./PlaceOrder.css"
import { StoreContext } from '../../context/StoreContext'
import { API_BASE_URL, readJsonResponse } from '../../config/api'
import { useNavigate } from 'react-router-dom'

function PlaceOrder({ setUser = () => {} }) {
  const { cartItems, food_list, getTotalCartAmount, clearCart } = useContext(StoreContext)
  const navigate = useNavigate()
  const savedUser = JSON.parse(localStorage.getItem("user") || "null")
  const [formData, setFormData] = useState({
    firstName: savedUser?.name?.split(" ")[0] || "",
    lastName: savedUser?.name?.split(" ").slice(1).join(" ") || "",
    email: savedUser?.email || "",
    dob: "",
    street: "",
    city: savedUser?.city || "",
    state: "",
    zipCode: "",
    country: "",
    phoneNumber: savedUser?.phoneNumber || "",
    paymentMethod: "cash",
  })
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subtotal = getTotalCartAmount()
  const deliveryFee = subtotal === 0 ? 0 : 2
  const total = subtotal + deliveryFee

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage("")
    setIsSubmitting(true)

    const payload = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      dob: formData.dob,
      city: formData.city,
      address: `${formData.street}, ${formData.city}, ${formData.state}, ${formData.zipCode}, ${formData.country}`,
      phoneNumber: formData.phoneNumber,
    }

    try {
      if (!savedUser?._id) {
        throw new Error("Please sign up or login before placing an order.")
      }

      const userResponse = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const userData = await readJsonResponse(userResponse)

      if (!userResponse.ok) {
        throw new Error(userData.message || "Could not save user details")
      }

      localStorage.setItem("user", JSON.stringify(userData.user))
      if (typeof setUser === "function") {
        setUser(userData.user)
      }

      const orderItems = food_list
        .filter((item) => cartItems[item._id] > 0)
        .map((item) => ({
          foodId: item._id,
          name: item.name,
          price: item.price,
          quantity: cartItems[item._id],
        }))

      const orderResponse = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: savedUser._id,
          customer: {
            name: payload.name,
            email: payload.email,
            phoneNumber: payload.phoneNumber,
          },
          items: orderItems,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          subtotal,
          deliveryFee,
          total,
          paymentMethod: formData.paymentMethod,
        }),
      })
      const orderData = await readJsonResponse(orderResponse)

      if (!orderResponse.ok) {
        throw new Error(orderData.message || "Could not place order")
      }

      clearCart()
      setMessage("Order placed successfully.")
      navigate("/profile")
    } catch (error) {
      setMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='place-order'>
      <form className='place-order-form' onSubmit={handleSubmit}>
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input name="firstName" type="text" placeholder='First name' value={formData.firstName} onChange={handleChange} required />
            <input name="lastName" type="text" placeholder='Last name' value={formData.lastName} onChange={handleChange} required />
          </div>
          <input name="email" type="email" placeholder='Email address' value={formData.email} onChange={handleChange} required />
          <input name="dob" type="date" value={formData.dob} onChange={handleChange} required />
          <input name="street" type="text" placeholder='Street' value={formData.street} onChange={handleChange} required />
          <div className="multi-fields">
            <input name="city" type="text" placeholder='City' value={formData.city} onChange={handleChange} required />
            <input name="state" type="text" placeholder='State' value={formData.state} onChange={handleChange} required />
          </div>
          <div className="multi-fields">
            <input name="zipCode" type="text" placeholder='Zip code' value={formData.zipCode} onChange={handleChange} required />
            <input name="country" type="text" placeholder='Country' value={formData.country} onChange={handleChange} required />
          </div>
          <input name="phoneNumber" type="tel" placeholder='Phone' value={formData.phoneNumber} onChange={handleChange} required />
          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
            <option value="cash">Cash on delivery</option>
            <option value="card">Card on delivery</option>
          </select>
          {message && <p className="place-order-message">{message}</p>}
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${subtotal}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${deliveryFee}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>${total}</b>
              </div>
            </div>
            <button type='submit' disabled={subtotal === 0 || isSubmitting}>
              {isSubmitting ? "Saving..." : "Proceed to payment"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PlaceOrder
