import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface AdminKeyApiResponse {
    data: boolean | null;
    errorMessage: string | null;
}

const PATH = 'validateadminkey';
const baseUrl = `${import.meta.env.VITE_SETTINGS_SERVICE_URL as string}/${PATH}`;

export const adminKeyApiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl,
    }),
    reducerPath: `${PATH}Api`,
    endpoints: (build) => ({
        validateAdminKey: build.query<AdminKeyApiResponse, string>({
            query: (keyToValidate) => ({
                url: '',
                method: 'GET',
                headers: { 'x-admin-key': keyToValidate },
            }),
        }),
    }),
});

export const { useLazyValidateAdminKeyQuery } = adminKeyApiSlice;
