import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Settings } from '../../types';
import { SETTINGS_SERVICE_URL } from '../../constants';

interface SettingsApiResponse {
    data: Settings | null;
    errorMessage: string | null;
}

interface SettingsPayloadWithAdminKey {
    settings: Settings;
    adminKey: string;
}

const PATH = 'settings';

export const settingsApiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: SETTINGS_SERVICE_URL,
    }),
    reducerPath: `${PATH}Api`,
    endpoints: (build) => ({
        getSettings: build.query<SettingsApiResponse, void>({
            query: () => ({
                url: '',
                method: 'GET',
            }),
        }),
        postSettings: build.mutation<
            SettingsApiResponse,
            SettingsPayloadWithAdminKey
        >({
            query: (payload) => ({
                url: '',
                method: 'POST',
                body: payload.settings,
                headers: { 'x-admin-key': payload.adminKey },
            }),
        }),
    }),
});

export const { useGetSettingsQuery, usePostSettingsMutation } =
    settingsApiSlice;
