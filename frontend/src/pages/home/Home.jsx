import React, { useState } from 'react'
import "./Home.css"
import Header from '../../componenets/Header/Header.jsx'
import ExploreMenu from '../../ExploreMenu/ExploreMenu.jsx'
import FoodDisplay from '../../componenets/FoodDisplay/FoodDisplay.jsx'
import Appdownload from '../../componenets/Appdownload/Appdownload.jsx'
function Home({ globalSearch, setGlobalSearch }) {
  const [cat,setCat]=useState("All")
  const quickSearches = ["Biryani", "Pizza", "Burger", "Paneer", "Noodles", "Sushi"]

  return (
    <div id="home">
      <Header/>
      <div className="quick-searches">
        {quickSearches.map((item) => (
          <button key={item} type="button" onClick={() => setGlobalSearch(item)}>
            {item}
          </button>
        ))}
        {globalSearch && <button type="button" onClick={() => setGlobalSearch("")}>Clear</button>}
      </div>
      <ExploreMenu category={cat} setCategory={setCat}/>
      <FoodDisplay category={cat} globalSearch={globalSearch}/>
      <Appdownload/>
    </div>
  )
}

export default Home
