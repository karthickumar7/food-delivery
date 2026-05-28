import React from 'react'
import "./ExploreMenu.css"
import { menu_list } from "../assets/assets.js"

function ExploreMenu({category,setCategory}) {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore Our Menu</h1>

      <p className="explore-menu-text">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, ratione earum illum error nostrum non rerum vitae eum sunt obcaecati eos a sapiente similique cum labore voluptatem officia temporibus facilis.
      </p>

      <div className="explore-menu-list">
        {menu_list.map((menu) => (
          <div onClick={()=>setCategory(prev=>prev===menu.menu_name?"All" : menu.menu_name)} key={menu.menu_name} className="explore-menu-list-item">
            <img src={menu.menu_image} className={category===menu.menu_name?"Active":""} alt={menu.menu_name} />
            <p>{menu.menu_name}</p>
          </div>
        ))}
      </div><hr/>
    </div>
    
  )
}

export default ExploreMenu