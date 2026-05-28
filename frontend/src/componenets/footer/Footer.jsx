import React from 'react'
import "./Footer.css"
import { assets } from '../../assets/assets'

const Footer = ({ setPage }) => {
  const scrollToSection = (sectionId, pageName) => {
    setPage(pageName)
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="Tomato" />
          <p>Fresh food delivered fast. Explore your favorite meals, add them to your cart, and enjoy a smooth ordering experience.</p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon}  alt="Facebook" />
            <img src={assets.twitter_icon} alt="Twitter" />
            <img src={assets.linkedin_icon} alt="LinkedIn" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li onClick={() => scrollToSection('home', 'home')}>Home</li>
            <li onClick={() => scrollToSection('explore-menu', 'menu')}>Menu</li>
            <li onClick={() => scrollToSection('app-download', 'mobile-app')}>Mobile app</li>
            <li onClick={() => scrollToSection('footer', 'contact us')}>Contact us</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+1-212-456-7890</li>
            <li>contact@tomato.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2026 Tomato.com - All rights reserved.</p>
    </div>
  )
}

export default Footer
