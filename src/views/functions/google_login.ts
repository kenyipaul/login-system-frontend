import Axios, { AxiosError } from "axios"
import { googleLoginRoute } from "../../routes/route";

interface UserType {
    "access_token": string,
    "token_type": string,
    "expires_in": number,
    "scope": string,
    "authuser": string,
    "prompt": string
}

export const googleLogin = (user: UserType, callback: (response: any, error?: AxiosError) => void) => {
    Axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
        headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: 'application/json'
        }
    })
    .then((res) => {
        Axios({
            method: "POST",
            url: googleLoginRoute,
            data: {
                id: res.data.id,
                username: res.data.name,
                email: res.data.email,
                profile: res.data.picture
            },
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            if (response.data.acknowledged) {
                return callback(response)
            }
        }).catch((err) => {
            return callback(null, err);
        })
    })
    .catch((err) => console.log(err));
}