import { useState } from 'react'
import Navbar from './componenets/navbar/Navbar.jsx'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home.jsx'
import Cart from './pages/cart/Cart.jsx'
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder.jsx"
import Profile from './pages/profile/Profile.jsx'
import Footer from './componenets/footer/Footer.jsx'
import Notfound from './componenets/NotFound/Notfound.jsx'
import Loginpop from './componenets/LoginPopUp/Loginpop.jsx'
import Datepicker from "./componenets/Date/Datepicker.jsx"
import OtpChecker from "./componenets/OTP/OtpChecker.jsx"
import PhoneNumber from "./componenets/PhoneNumber/PhoneNumber.jsx"
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const [page, setPage] = useState("home");
  const [showLogin,SetshowLogin]=useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user")
    return savedUser ? JSON.parse(savedUser) : null
  })
  return (
    <>
    {
      showLogin?<Loginpop SetshowLogin={SetshowLogin} setUser={setUser}/>:<></>
    }
    <div className="app">
      <Navbar page={page} setPage={setPage} SetshowLogin={SetshowLogin} user={user} setUser={setUser} globalSearch={globalSearch} setGlobalSearch={setGlobalSearch}/>
      <Routes>
        <Route path="/" element={<Home globalSearch={globalSearch} setGlobalSearch={setGlobalSearch}/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path="/order" element={
          <ProtectedRoute user={user}><PlaceOrder setUser={setUser}/></ProtectedRoute>
        }/>
        <Route path="/profile" element={
          <ProtectedRoute user={user}><Profile user={user} setUser={setUser}/></ProtectedRoute>
        }/>
        <Route path='/date' element={<Datepicker/>}/>
        <Route path="/phonenumber" element={<PhoneNumber/>}/>
        <Route path="/otp" element={<OtpChecker setUser={setUser}/>}/>
         <Route path='*' element={<Notfound/>}/>
      </Routes>
    </div>  
    <Footer setPage={setPage}/>
    </>
  )
}

export default App
