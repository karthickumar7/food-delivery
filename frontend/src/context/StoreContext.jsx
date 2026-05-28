import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";
export const StoreContext=createContext(null)
const StoreContextProvider=(props)=>{
    const [cartItems,SetCartItems]=useState(() => {
        const savedCart = localStorage.getItem("cartItems")
        return savedCart ? JSON.parse(savedCart) : {}
    })
    const [favoriteItems, setFavoriteItems] = useState(() => {
        const savedFavorites = localStorage.getItem("favoriteItems")
        return savedFavorites ? JSON.parse(savedFavorites) : {}
    })

    const addToCart=(itemId)=>{
        SetCartItems((prev)=>({...prev,[itemId]:(prev[itemId] || 0)+1}))
    }

    const removeFromCart=(itemId)=>{
        SetCartItems((prev)=>{
            if (!prev[itemId]) return prev

            const updatedCart = {...prev}
            updatedCart[itemId] -= 1

            if (updatedCart[itemId] <= 0) {
                delete updatedCart[itemId]
            }

            return updatedCart
        })
    }

    const clearCart=()=>{
        SetCartItems({})
    }

    const toggleFavorite=(itemId)=>{
        setFavoriteItems((prev)=>{
            const updatedFavorites = {...prev}

            if (updatedFavorites[itemId]) {
                delete updatedFavorites[itemId]
            } else {
                updatedFavorites[itemId] = true
            }

            return updatedFavorites
        })
    }

    const getTotalCartAmount=()=>{
        return food_list.reduce((total,item)=>total + item.price * (cartItems[item._id] || 0),0)
    }

    const getTotalCartItems=()=>{
        return Object.values(cartItems).reduce((total,quantity)=>total + quantity,0)
    }

    const contextValue={
        food_list,
        cartItems,
        SetCartItems,
        favoriteItems,
        addToCart,
        removeFromCart,
        clearCart,
        toggleFavorite,
        getTotalCartAmount,
        getTotalCartItems
    }

    useEffect(()=>{
        localStorage.setItem("cartItems", JSON.stringify(cartItems))
    },[cartItems])

    useEffect(()=>{
        localStorage.setItem("favoriteItems", JSON.stringify(favoriteItems))
    },[favoriteItems])

    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider;
