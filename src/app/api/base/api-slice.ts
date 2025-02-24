import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { Response } from "../types/response";
import { TokenRes } from "../types/auth.type";
import { logOut } from "../auth/auth-slice";
import { apiEndpoints } from "../constants";
import { EnvVariable } from "@/configuration/env-variable";

const baseQuery = fetchBaseQuery({
  baseUrl: EnvVariable.API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  object,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  const statusCode = result.error?.status;
  if (statusCode === 401 || statusCode === 403) {
    console.log("refresh token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
      try {
        const refreshResult = (await baseQuery(
          apiEndpoints.REFRESH_TOKEN,
          api,
          { body: { refreshToken }, method: "POST" }
        )) as Response<TokenRes>;

        console.log("After refresh token", refreshResult);

        if (refreshResult.data) {
          console.log(refreshResult.data);
          localStorage.setItem(
            "refresh_token",
            refreshResult.data.refreshToken
          );
          localStorage.setItem("access_token", refreshResult.data.accessToken);
        }
      } catch {
        api.dispatch(logOut());
      }
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }

    return result;
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({}),
});
