import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import * as api from "~/api/client";
import { IUser } from "~/types/users.types";

export const plannerApi = createApi({
  reducerPath: "plannerApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getUser: builder.query<IUser, void>({
      queryFn: async () => {
        const user = await api.user.load();
        return { data: user };
      },
    }),
  }),
});

export const { useGetUserQuery } = plannerApi;
