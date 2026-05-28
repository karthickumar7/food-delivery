import React, { useContext } from 'react'
import "./FoodItem.css"
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext';

function FoodItem({ id, name, price, description, image }) {
  const {cartItems,
        addToCart,
        removeFromCart,
        favoriteItems,
        toggleFavorite} =useContext(StoreContext)
  const isFavorite = favoriteItems[id]

  return (
    <div className='food-item'>
      <div className="food-item-image-container">
        <img src={image} className='food-item-image' alt={name} />
        <button
          className={`favorite-button ${isFavorite ? "active" : ""}`}
          type="button"
          onClick={() => toggleFavorite(id)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "Saved" : "Save"}
        </button>
        {
          !cartItems[id] ? <img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} alt="" />
            : <div className='food-item-counter'>
              <img src={assets.remove_icon_red} className='remove-icon' onClick={()=>removeFromCart(id)} alt="" />
              <p>{cartItems[id]}</p>
              <img src={assets.add_icon_green} className='add-icon-green' onClick={()=>addToCart(id)} alt="" />
            </div>
        }
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  )
}

export default FoodItem
