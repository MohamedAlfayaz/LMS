import { loginUser, registerUser } from "../api/authApi";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
    return useMutation({
        mutationFn: loginUser
    })
}

export const useRegister = () => {
    return useMutation({
        mutationFn: registerUser
    })
}