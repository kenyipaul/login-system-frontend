import Axios, { AxiosError } from "axios";
import { loginRoute } from "../../routes/route";

type RefType = React.RefObject<HTMLInputElement>

export const loginFunc = (emailRef: RefType, passRef: RefType, callback: (response: any, error?: AxiosError) => void) => {
    const email = emailRef.current!.value;
    const password = passRef.current!.value;

    Axios({
        method: "POST",
        url: loginRoute,
        data: { email, password }
    }).then((response) => {
        if (response.data.acknowledged) {
            callback(response)
        }
    }).catch((err) => {
        return callback(null, err)
    })
}