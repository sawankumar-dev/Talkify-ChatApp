import { Navigate, Outlet } from "react-router"
import { useAppSelector } from "../../shared/hooks/hooks"

const AuthProtected = () => {
    const { isAuthenticated }  = useAppSelector((state) => state.auth)
    if(isAuthenticated) {
        return <Navigate to={"/"} replace/>
    }
  return (
    <Outlet/>
  )
}

export default AuthProtected