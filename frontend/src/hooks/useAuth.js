import { loginUser, registerUser, forgotPassword, resetPassword } from "../api/authApi";
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

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};