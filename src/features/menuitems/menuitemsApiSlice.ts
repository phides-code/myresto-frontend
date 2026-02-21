import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Menuitem } from '../../types';

interface MenuitemsApiResponse {
    data: Menuitem[] | null;
    errorMessage: string | null;
}

interface MenuitemApiResponse {
    data: Menuitem | null;
    errorMessage: string | null;
}

interface MenuitemPayloadWithAdminKey {
    menuitem: Partial<Menuitem>;
    adminKey: string;
}

interface MenuitemIdPayloadWithAdminKey {
    id: string;
    adminKey: string;
}

const PATH = 'menuitems';

export const menuitemsApiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_MENUITEMS_SERVICE_URL as string,
    }),
    reducerPath: `${PATH}Api`,
    endpoints: (build) => ({
        getMenuitems: build.query<MenuitemsApiResponse, void>({
            query: () => ({
                url: '',
                method: 'GET',
            }),
        }),
        getMenuitemById: build.query<MenuitemApiResponse, string>({
            query: (id) => ({
                url: `/${id}`,
                method: 'GET',
            }),
        }),
        postMenuitem: build.mutation<
            MenuitemApiResponse,
            MenuitemPayloadWithAdminKey
        >({
            query: (payload) => ({
                url: '',
                method: 'POST',
                body: payload.menuitem,
                headers: { 'x-admin-key': payload.adminKey },
            }),
        }),
        deleteMenuitem: build.mutation<
            MenuitemApiResponse,
            MenuitemIdPayloadWithAdminKey
        >({
            query: (payload) => ({
                url: `/${payload.id}`,
                method: 'DELETE',
                headers: { 'x-admin-key': payload.adminKey },
            }),
        }),
        putMenuitem: build.mutation<
            MenuitemApiResponse,
            MenuitemPayloadWithAdminKey
        >({
            query: (payload) => ({
                url: `/${payload.menuitem.id}`,
                method: 'PUT',
                body: payload.menuitem,
                headers: { 'x-admin-key': payload.adminKey },
            }),
        }),
    }),
});

export const {
    useGetMenuitemsQuery,
    useGetMenuitemByIdQuery,
    usePostMenuitemMutation,
    useDeleteMenuitemMutation,
    usePutMenuitemMutation,
} = menuitemsApiSlice;
