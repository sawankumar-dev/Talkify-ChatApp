import { Outlet } from "react-router"

const AuthLayout = () => {
  return (
    <div>
      <div>
        Auth Layout
      </div>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default AuthLayout