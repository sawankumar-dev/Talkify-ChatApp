import { createBrowserRouter, RouterProvider } from "react-router"
import HomePage from "../shared/ui/pages/HomePage"
import AuthProtected from "./protected/AuthProtected"
import AuthLayout from "../app/layouts/AuthLayout"
import LoginPage from "@/features/Auth/ui/pages/LoginPage"
import RegisterPage from "@/features/Auth/ui/pages/RegisterPage"

const MainRoutes = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <HomePage/>
        },
        {
          path: "/auth",
          element: <AuthProtected/>,
          children: [
            {
              path: "",
              element: <AuthLayout/>,
              children: [
                {
                  path: "",
                  element: <LoginPage/>
                },
                {
                  path: "register",
                  element: <RegisterPage/>
                }
              ]
            }
          ]
        }
    ])
  return (
    <RouterProvider router={router}/>
  )
}

export default MainRoutes