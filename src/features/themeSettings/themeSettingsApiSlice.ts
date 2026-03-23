import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ThemeSettings } from '../../types';
import { SETTINGS_SERVICE_URL } from '../../constants';

interface ThemeSettingsApiResponse {
    data: ThemeSettings | null;
    errorMessage: string | null;
}

interface ThemeSettingsPayloadWithAdminKey {
    themeSettings: ThemeSettings;
    adminKey: string;
}

const PATH = 'themesettings';

export const themeSettingsApiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: SETTINGS_SERVICE_URL,
    }),
    reducerPath: `${PATH}Api`,
    endpoints: (build) => ({
        getThemeSettings: build.query<ThemeSettingsApiResponse, void>({
            query: () => ({
                url: '/themesettings',
                method: 'GET',
            }),
        }),
        postThemeSettings: build.mutation<
            ThemeSettingsApiResponse,
            ThemeSettingsPayloadWithAdminKey
        >({
            query: (payload) => ({
                url: '/themesettings',
                method: 'POST',
                body: payload.themeSettings,
                headers: { 'x-admin-key': payload.adminKey },
            }),
        }),
    }),
});

export const { useGetThemeSettingsQuery, usePostThemeSettingsMutation } =
    themeSettingsApiSlice;
