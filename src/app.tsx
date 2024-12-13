import "./sass/main.scss"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Signup from "./views/signup"
import Login from "./views/login"
import { GoogleOAuthProvider } from "@react-oauth/google"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/signup",
        element: <Signup />
    },
    {
        path: "*",
        element: <NotFound />
    }
])

export default function App() {
    return (
        <>
        <GoogleOAuthProvider clientId="698727212239-udg0k9mthsigme9jjoap4ijc9ee0mko2.apps.googleusercontent.com">
            <RouterProvider router={router}/>
        </GoogleOAuthProvider>
        </>
    )
}

function NotFound() {
    return (
        <div className="notfound">
            <h1>404 | PAGE NOT FOUND</h1>
        </div>
    )
}