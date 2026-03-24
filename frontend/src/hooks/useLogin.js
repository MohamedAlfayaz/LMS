import { loginUser } from "../api/authApi";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
    return useMutation({
        mutationFn: loginUser
    })
}