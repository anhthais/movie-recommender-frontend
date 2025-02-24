import { apiSlice } from "../base/api-slice";
import { apiEndpoints } from "../constants";
import { Response } from "../types/response";
import { User } from "../types/user.type";

const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => (
        {
            getAuthentication: builder.query<Response<User>, void>({
                query: () => ({
                    url: apiEndpoints.ME,
                    method: 'GET'
                })
            }),
        }
    ),
});

export const {
    useLazyGetAuthenticationQuery,
    useGetAuthenticationQuery,
} = userApiSlice;