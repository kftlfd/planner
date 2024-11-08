import * as api from "~/api/client";
import { IUser } from "~/types/users.types";

import apiSlice from "./apiSlice";

const usersQueries = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<IUser, void>({
      queryFn: async () => {
        const user = await api.user.load();
        return { data: user };
      },
    }),
  }),
});

export const { useGetUserQuery } = usersQueries;
