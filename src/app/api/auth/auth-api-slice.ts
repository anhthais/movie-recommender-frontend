import { apiSlice } from "../base/api-slice";
import { Response } from "../types/response";
import { CreateUserReq, LoginReq, TokenRes } from "../types/auth.type";
import { apiEndpoints } from "../constants";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        register: builder.mutation<Response<TokenRes>, CreateUserReq>({
            query: body => ({
                url: apiEndpoints.REGISTER,
                method: 'POST',
                body 
            })
        }),
        googleLogin: builder.mutation<Response<TokenRes>, {token: string}>({
            query: body => ({
                url: apiEndpoints.GOOGLE_AUTH,
                method: 'POST',
                body
            })
        }),
        login: builder.mutation<Response<TokenRes>, LoginReq>({
            query: body => ({
                url: apiEndpoints.LOGIN,
                method: 'POST',
                body   
            })
        }),
        activateAccount: builder.query<void, {token: string}>({
            query: queryArg => ({
              url: `/auth/activate-account`,
              method: 'GET',
              params: queryArg,
            })
        }),
        sendActivateEmail: builder.query<void, {}>({
            query: queryArg => ({
              url: '/auth/resend-activate-email',
              method: 'GET',
              params: queryArg,
            })
        }),
        sendResetPassword: builder.query<void, {email: string}>({
          query: queryArg => ({
            url: `/auth/reset-password`,
            method: 'GET',
            params: queryArg,
          })
        }),
        resetPassword: builder.mutation<void, {
          token: string,
          password: string,
        }>({
          query: queryArg => ({
            url: `/auth/reset-password`,
            method: 'POST',
            body: queryArg,
          })
        }),
    })
});

export const {
    useRegisterMutation,
    useGoogleLoginMutation,
    useLoginMutation,
    useLazyActivateAccountQuery,
    useLazySendResetPasswordQuery,
    useResetPasswordMutation,
    useLazySendActivateEmailQuery,
} = authApiSlice