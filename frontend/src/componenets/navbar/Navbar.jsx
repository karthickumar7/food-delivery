import React, { useContext, useState } from 'react'
import "./Navbar.css"
import {assets} from "../../assets/assets"
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

function Navbar({ page, setPage ,SetshowLogin, user, setUser = () => {}, globalSearch = "", setGlobalSearch = () => {}}) {
  const { getTotalCartItems } = useContext(StoreContext)
  const totalCartItems = getTotalCartItems()
  const [showSearch, setShowSearch] = useState(false)

  const scrollToSection = (sectionId, pageName) => {
    setPage(pageName)
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  }
  const logout = () => {
    localStorage.removeItem("user")
    if (typeof setUser === "function") {
      setUser(null)
    }
    navigate("/")
  }
  const navigate=useNavigate()
  const openSearch = () => {
    setShowSearch((prev) => !prev)
    navigate("/")
    setTimeout(() => document.getElementById("food-display")?.scrollIntoView({ behavior: "smooth" }), 50)
  }

  return (
    <div className="navbar">
        <img className='logo' src={assets.logo} onClick={()=>{navigate('/')}}/>
        <ul className="navbar_menu">
          <li onClick={()=>scrollToSection('home', 'home')} className={page==="home"?"active" :" "}>Home</li>
          <li onClick={()=>scrollToSection('explore-menu', 'menu')} className={page==="menu"?"active" :" "}>Menu</li>
          <li onClick={()=>scrollToSection('app-download', 'mobile-app')} className={page==="mobile-app"?"active" :" "}>Mobile-app</li>
          <li onClick={()=>scrollToSection('footer', 'contact us')} className={page==="contact us"?"active" :" "}>Contact us</li>
        </ul>
        <div className="navbar-right">
          <div className={`navbar-search ${showSearch ? "open" : ""}`}>
            <button type="button" className="navbar-search-button" onClick={openSearch} aria-label="Search food">
              <img src={assets.search_icon} alt="" />
            </button>
            {showSearch && (
              <input
                type="search"
                placeholder="Search biryani, pizza..."
                value={globalSearch}
                onChange={(event) => setGlobalSearch(event.target.value)}
                autoFocus
              />
            )}
          </div>
          <div className="navbar-search-icon">
            <img src={assets.basket_icon}onClick={()=>navigate('/cart')} />
            {totalCartItems > 0 && <div className="dot">{totalCartItems}</div>}
          </div>
          {user ? (
            <div className="navbar-profile">
              <img className="navbar-profile-img" src={user.avatarUrl || assets.profile_icon} alt="Profile" onClick={() => navigate("/profile")} />
              <button type="button" onClick={logout}>Logout</button>
            </div>
          ) : (
            <button
            onClick={()=>SetshowLogin(true)}
            >Sign In</button>
          )}
        </div>
    </div>
  )
}

export default Navbar
