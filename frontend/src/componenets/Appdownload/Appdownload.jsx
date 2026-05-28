import React from 'react'
import "./Appdownload.css"
import { assets } from '../../assets/assets'

const Appdownload = () => {
  return (
    <div id='app-download' className='app-download'>
        <p>For better experience download <br/>Tomato App</p>
        <div className="app-download-platforms">
            <img src={assets.play_store} alt="Get it on Google Play" />
            <img src={assets.app_store} alt="Download on the App Store" />
        </div>
    </div>
  )
}

export default Appdownload
