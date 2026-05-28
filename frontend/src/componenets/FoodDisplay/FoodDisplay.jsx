import React, { useContext, useMemo, useState } from 'react'
import "./FoodDisplay.css"
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
function FoodDisplay({category, globalSearch = ""}) {
    const { food_list } = useContext(StoreContext)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState("featured")
    const [vegOnly, setVegOnly] = useState(false)
    const vegKeywords = ["veg", "salad", "mushroom", "cauliflower", "pulao", "zucchini", "pasta", "noodles", "paneer", "dal", "idli", "dosa"]

    const filteredFoods = useMemo(() => {
      const normalizedSearch = `${globalSearch} ${searchTerm}`.trim().toLowerCase()

      return food_list
        .filter((food) => category === "All" || category === food.category)
        .filter((food) => {
          if (!normalizedSearch) return true
          return `${food.name} ${food.description} ${food.category}`.toLowerCase().includes(normalizedSearch)
        })
        .filter((food) => {
          if (!vegOnly) return true
          return vegKeywords.some((keyword) => `${food.name} ${food.category}`.toLowerCase().includes(keyword))
        })
        .sort((a, b) => {
          if (sortBy === "price-low") return a.price - b.price
          if (sortBy === "price-high") return b.price - a.price
          if (sortBy === "name") return a.name.localeCompare(b.name)
          return Number(a._id) - Number(b._id)
        })
    }, [category, food_list, globalSearch, searchTerm, sortBy, vegOnly])

  return (
    <div id="food-display" className="food-display">
        <div className="food-display-header">
          <div>
            <h2>Top Dishes Near You</h2>
            <p>{filteredFoods.length} dishes available</p>
          </div>
          <div className="food-display-controls">
            <input
              type="search"
              placeholder="Search dishes"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="name">Name</option>
            </select>
            <label className="veg-filter">
              <input type="checkbox" checked={vegOnly} onChange={(event) => setVegOnly(event.target.checked)} />
              Veg only
            </label>
          </div>
        </div>
        <div className="food-display-list">
            {filteredFoods.map((food)=>(
              <FoodItem 
                key={food._id} 
                id={food._id} 
                name={food.name} 
                description={food.description} 
                price={food.price} 
                image={food.image}
              />
            ))}
        </div>
        {filteredFoods.length === 0 && <p className="food-display-empty">No dishes matched your filters.</p>}
    </div>
  )
}

export default FoodDisplay
