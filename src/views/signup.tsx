import Axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { useGoogleLogin } from "@react-oauth/google"
import { useEffect, useRef, useState } from "react"
import { googleLoginRoute, googleSignupRoute, signupRoute } from "../routes/route"
import { signupFunc } from "./functions/signup"

interface ProfileType {
    "id": string,
    "email": string,
    "verified_email": boolean,
    "name": string,
    "given_name": string,
    "family_name": string,
    "picture": string
}

interface UserType {
    "access_token": string,
    "token_type": string,
    "expires_in": number,
    "scope": string,
    "authuser": string,
    "prompt": string
}

export default function Signup() {

    const navigate = useNavigate();

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);

    const [user, setUser] = useState<UserType>();
    const [profile, setProfile] = useState<ProfileType>();

    const registerWithGoogle = useGoogleLogin({
        onSuccess: (response: any) => setUser(response),
        onError: (error) => {
            console.error(error)
        } 
    })

    useEffect(() => {
        if (user) {

            Axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                headers: {
                    Authorization: `Bearer ${user.access_token}`,
                    Accept: 'application/json'
                }
            })
            .then((res) => {
                setProfile(res.data);
            })
            .catch((err) => console.log(err));

        }
    }, [user])

    useEffect(() => {
        if (profile) {

            Axios({
                method: "POST",
                url: googleLoginRoute,
                data: {
                    id: profile.id,
                    username: profile.name,
                    email: profile.email,
                    profile: profile.picture
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((response) => {
                sessionStorage.setItem("token", response.data.token)
                navigate("/home")
            }).catch((error) => {
                return  !error.response.acknowledged && alert(error.response.data.msg)
            })

        }
    }, [profile])


    const signup = () => signupFunc(nameRef, emailRef, passRef, (response, error: any) => {
        if (error) { alert(error.response?.data.msg) }

        if (response.data.acknowledged) {
            document.querySelector("form")!.reset()
            if (confirm("Signup was successful, would you like to login now?")) {
                navigate("/")
            }
        }
    });

    return (
        <div className="form-container">

            <form action="#">
                <h1>SIGN UP</h1>

                <div className="option">
                    <button onClick={() => registerWithGoogle()}>
                        <svg width="24" height="24" viewBox="-0.5 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"> <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </svg>
                        <p>Continue with Google</p>
                    </button>
                    <div className="or"> <span></span> <p>OR</p> <span></span> </div>
                </div>

                <div className="input-area">
                    <label htmlFor="username">Username</label>
                    <input ref={nameRef} type="text" id="username" />
                </div>

                <div className="input-area">
                    <label htmlFor="email">Email</label>
                    <input ref={emailRef} type="email" id="email" />
                </div>

                <div className="input-area">
                    <label htmlFor="password">Password</label>
                    <input ref={passRef} type="password" id="password" />
                </div>

                <p>I already have an account? <Link to="/">login here</Link></p>
                <button onClick={signup} type="button">Sign Up</button>
            </form>

        </div>
    )
}