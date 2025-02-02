import Axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface UserType {
    id: string,
    username: string,
    email: string,
    method: string,
    profile: string,
    date: string,
    iat: string,
    exp: string
}

export default function Home() {

    const navigate = useNavigate();
    const [user, setUser] = useState<UserType>();
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        let token = sessionStorage.getItem("token")

        if (token) {
            Axios({
                method: "POST",
                url: "http://localhost:3303/api/auth",
                headers: {
                    "Authorization": `bearer ${token}`
                }
            }).then((response) => {
                if (response.data.authorized) {
                    setUser(response.data.data)
                    setLoading(false)
                }
            }).catch((err) => {
                if (!err.response.data.authorized) {
                    alert("Expired or Invalid session")
                    sessionStorage.removeItem("token")
                    navigate("/")
                }
            })
        } else {
            navigate("/")
        }

    }, [])

    const logout = () => {
        if (confirm("Are you sure you want to logout?")) {    
            sessionStorage.removeItem("token")
            navigate("/")
        }
    }

    return (
        <div className="home">

            {
                loading ? <>Loading...</> :

                <div className="card">
                    <div className="header">
                        <div className="profile-image" style={{
                            backgroundImage: `url(${user?.method == "manual" ? "" : user?.profile})`
                        }}></div>
                        <svg onClick={logout} viewBox="0 0 24 24" width="2rem" height="2rem" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.00195 7C8.01406 4.82497 8.11051 3.64706 8.87889 2.87868C9.75757 2 11.1718 2 14.0002 2H15.0002C17.8286 2 19.2429 2 20.1215 2.87868C21.0002 3.75736 21.0002 5.17157 21.0002 8V16C21.0002 18.8284 21.0002 20.2426 20.1215 21.1213C19.2429 22 17.8286 22 15.0002 22H14.0002C11.1718 22 9.75757 22 8.87889 21.1213C8.11051 20.3529 8.01406 19.175 8.00195 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path> <path d="M8 19.5C5.64298 19.5 4.46447 19.5 3.73223 18.7678C3 18.0355 3 16.857 3 14.5V9.5C3 7.14298 3 5.96447 3.73223 5.23223C4.46447 4.5 5.64298 4.5 8 4.5" stroke="currentColor" stroke-width="1.5"></path> <path d="M15 12L6 12M6 12L8 14M6 12L8 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    </div>
                    <div className="main">
                        <h1>{user?.username}</h1>
                        <h3>{user?.email}</h3>
                        <p>User Since: {user?.date}</p>
                    </div>
                    <div className="footer">
                        {
                            user?.method == "manual" && <button>Change Profile</button>
                        }
                        <button>Delete Account</button>
                    </div>
                </div>

            }

        </div>
    )
}