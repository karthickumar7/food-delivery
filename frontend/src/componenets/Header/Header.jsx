import React from 'react'
import "./Header.css"
function Header() {
  const scrollToMenu = () => {
    document.getElementById("explore-menu")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className='Header'>
        <div className="header-contents">
            <h2>Order Your Favourite food here</h2>
            <p>Fresh meals, fast delivery, live cart totals, saved profiles, and simple checkout from your favorite local dishes.</p>
            <button type="button" onClick={scrollToMenu}>View Menu</button>
            </div>
    </div>
  )
}

export default Header
