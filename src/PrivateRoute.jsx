import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import HomePage from "./pages/HomePage";

const PrivateRoute = () => {
    const {userInfo} = useSelector((state)=> state.auth);

  return userInfo ? <HomePage /> : <Navigate to='/' replace />
}

export default PrivateRoute
