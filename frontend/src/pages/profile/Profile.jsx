import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./Profile.css"
import { API_BASE_URL, readJsonResponse } from '../../config/api'

function Profile({ user, setUser = () => {} }) {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState("")
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    dob: user?.dob ? user.dob.slice(0, 10) : "",
    city: user?.city || "",
    address: user?.address || "",
    phoneNumber: user?.phoneNumber || "",
    avatarUrl: user?.avatarUrl || "",
  })

  const logout = () => {
    localStorage.removeItem("user")
    if (typeof setUser === "function") {
      setUser(null)
    }
    navigate("/")
  }

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?._id) return

      setIsLoadingOrders(true)
      try {
        const response = await fetch(`${API_BASE_URL}/api/orders?userId=${user._id}`)
        const data = await readJsonResponse(response)

        if (response.ok) {
          setOrders(data.orders)
        }
      } finally {
        setIsLoadingOrders(false)
      }
    }

    loadOrders()
  }, [user?._id])

  useEffect(() => {
    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
      dob: user?.dob ? user.dob.slice(0, 10) : "",
      city: user?.city || "",
      address: user?.address || "",
      phoneNumber: user?.phoneNumber || "",
      avatarUrl: user?.avatarUrl || "",
    })
  }, [user])

  if (!user) {
    return (
      <div className="profile">
        <div className="profile-empty">
          <h2>No profile found</h2>
          <p>Please sign in to view your profile details.</p>
          <button type="button" onClick={() => navigate("/")}>Go home</button>
        </div>
      </div>
    )
  }

  const details = [
    ["Name", user.name],
    ["Email", user.email],
    ["Date of birth", user.dob ? new Date(user.dob).toLocaleDateString() : ""],
    ["City", user.city],
    ["Address", user.address],
    ["Phone number", user.phoneNumber],
  ]

  const handleProfileChange = (event) => {
    const { name, value } = event.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setProfileForm((prev) => ({ ...prev, avatarUrl: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const saveProfile = async (event) => {
    event.preventDefault()
    setMessage("")

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileForm),
      })
      const data = await readJsonResponse(response)

      if (!response.ok) {
        throw new Error(data.message || "Could not update profile")
      }

      localStorage.setItem("user", JSON.stringify(data.user))
      setUser(data.user)
      setIsEditing(false)
      setMessage("Profile updated.")
    } catch (error) {
      setMessage(error.message)
    }
  }

  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {
        method: "PATCH",
      })
      const data = await readJsonResponse(response)

      if (!response.ok) {
        throw new Error(data.message || "Could not cancel order")
      }

      setOrders((prev) => prev.map((order) => order._id === orderId ? data.order : order))
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="profile">
      <div className="profile-header">
        {user.avatarUrl ? (
          <img className="profile-avatar profile-avatar-img" src={user.avatarUrl} alt={user.name} />
        ) : (
          <div className="profile-avatar">{user.name?.charAt(0)?.toUpperCase() || "U"}</div>
        )}
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
        <button className="profile-edit-button" type="button" onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? "Close" : "Edit Profile"}
        </button>
      </div>

      {message && <p className="profile-message">{message}</p>}

      {isEditing && (
        <form className="profile-edit-form" onSubmit={saveProfile}>
          <label className="profile-avatar-upload">
            {profileForm.avatarUrl ? (
              <img src={profileForm.avatarUrl} alt="Profile preview" />
            ) : (
              <span>{profileForm.name?.charAt(0)?.toUpperCase() || "U"}</span>
            )}
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
            <b>Change photo</b>
          </label>
          <input name="name" type="text" placeholder="Name" value={profileForm.name} onChange={handleProfileChange} required />
          <input name="email" type="email" placeholder="Email" value={profileForm.email} onChange={handleProfileChange} required />
          <input name="dob" type="date" value={profileForm.dob} onChange={handleProfileChange} required />
          <input name="city" type="text" placeholder="City" value={profileForm.city} onChange={handleProfileChange} required />
          <input name="address" type="text" placeholder="Address" value={profileForm.address} onChange={handleProfileChange} required />
          <input name="phoneNumber" type="tel" placeholder="Phone number" value={profileForm.phoneNumber} onChange={handleProfileChange} required />
          <button type="submit">Save profile</button>
        </form>
      )}

      <div className="profile-details">
        {details.map(([label, value]) => (
          <div className="profile-detail" key={label}>
            <span>{label}</span>
            <p>{value || "Not added"}</p>
          </div>
        ))}
      </div>

      <div className="profile-orders">
        <h3>Order History</h3>
        {isLoadingOrders ? (
          <p className="profile-muted">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="profile-muted">No orders yet.</p>
        ) : (
          <div className="profile-order-list">
            {orders.map((order) => (
              <div className="profile-order" key={order._id}>
                <div>
                  <b>Order #{order._id.slice(-6).toUpperCase()}</b>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <span>{order.items.length} item{order.items.length === 1 ? "" : "s"}</span>
                  <b>${order.total}</b>
                </div>
                <div className="profile-order-actions">
                  <p className="profile-order-status">{order.status.replaceAll("-", " ")}</p>
                  {!["delivered", "cancelled"].includes(order.status) && (
                    <button type="button" onClick={() => cancelOrder(order._id)}>Cancel</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="profile-logout" type="button" onClick={logout}>Logout</button>
    </div>
  )
}

export default Profile
