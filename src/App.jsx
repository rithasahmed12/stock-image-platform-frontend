import HomePage from "./pages/HomePage"
import { Route, Routes } from "react-router-dom"
import Loginpage from "./pages/Loginpage"
import SignupPage from "./pages/SignupPage"
import PrivateRoute from "./PrivateRoute"


function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Loginpage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/home" element={<PrivateRoute> <HomePage /></PrivateRoute>} />
    </Routes>
    </>
  )
}

export default App
