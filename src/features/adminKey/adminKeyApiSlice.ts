import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SETTINGS_SERVICE_URL } from '../../constants';

interface AdminKeyApiResponse {
    data: boolean | null;
    errorMessage: string | null;
}

const PATH = 'validateadminkey';
const baseUrl = `${SETTINGS_SERVICE_URL}/${PATH}`;

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
