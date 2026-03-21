import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ImageDataPayload } from '../../types';
import { IMAGES_SERVICE_URL } from '../../constants';

interface ImageApiResponse {
    data: string | null;
    errorMessage: string | null;
}

interface ImagePayloadWithAdminKey {
    imageData: ImageDataPayload;
    adminKey: string;
}

const PATH = 'images';

export const imagesApiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: IMAGES_SERVICE_URL,
    }),

    reducerPath: `${PATH}Api`,
    endpoints: (build) => ({
        uploadImage: build.mutation<ImageApiResponse, ImagePayloadWithAdminKey>(
            {
                query: (payload) => ({
                    url: '',
                    method: 'POST',
                    body: payload.imageData,
                    headers: { 'x-admin-key': payload.adminKey },
                }),
            },
        ),
    }),
});

export const { useUploadImageMutation } = imagesApiSlice;
