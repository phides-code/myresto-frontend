import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Theme } from '../../types';
import { SETTINGS_SERVICE_URL } from '../../constants';

interface ThemesApiResponse {
    data: Theme[] | null;
    errorMessage: string | null;
}

const PATH = 'themes';

export const themesApiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: SETTINGS_SERVICE_URL,
    }),
    reducerPath: `${PATH}Api`,
    endpoints: (build) => ({
        getThemes: build.query<ThemesApiResponse, void>({
            query: () => ({
                url: '/themes',
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetThemesQuery } = themesApiSlice;
