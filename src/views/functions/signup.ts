import Axios, { AxiosError } from "axios"
import { signupRoute } from "../../routes/route";

type RefType = React.RefObject<HTMLInputElement>

export const signupFunc = (nameRef: RefType, emailRef: RefType, passRef: RefType, callback: (response: any, error?: AxiosError) => void) => {
    const username = nameRef.current!.value;
    const email = emailRef.current!.value;
    const password = passRef.current!.value;

    Axios({
        method: "POST",
        url: signupRoute,
        data: {
            email: email,
            password: password,
            username: username,
        },
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        if (response.data.acknowledged) {
            return callback(response)
        }
    }).catch((error) => {
        return callback(null, error)
    })
}