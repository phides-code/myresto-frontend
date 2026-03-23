import { useState } from 'react';
import { useUploadImageMutation } from './imagesApiSlice';
import type { ImageDataPayload, ImageSource } from '../../types';
import { useAdminKey } from '../../context/AdminKeyContext';
import UploadedImage from './UploadedImage';
import { UPLOAD_IMAGE_KEY } from '../../constants';

/**
 * Use with an `imageKey` K such that `T[K]` is {@link ImageSource}.
 * (Call sites are checked: e.g. `Settings` + `'bannerImage'`, `NewOrUpdatedMenuitem` + `'imageSource'`.)
 */
export interface ImageUploaderProps<T, K extends keyof T> {
    parentForm: T;
    setParentForm: React.Dispatch<React.SetStateAction<T>>;
    imageKey: K;
}

const MAX_FILE_SIZE = 5; // 5MB

const ImageUploader = <T, K extends keyof T>({
    parentForm,
    setParentForm,
    imageKey,
}: ImageUploaderProps<T, K>) => {
    const [uploadImage, { isError, isLoading }] = useUploadImageMutation({
        fixedCacheKey: UPLOAD_IMAGE_KEY,
    });
    const [unsupportedFileError, setUnsupportedFileError] =
        useState<boolean>(false);

    const { getAdminKey } = useAdminKey();

    const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList = ev.target.files as FileList;
        const file: File = files[0];

        if (
            !file.type.includes('image/') ||
            file.size > MAX_FILE_SIZE * 1024 * 1024
        ) {
            setUnsupportedFileError(true);
            return;
        }

        const originalName: string = file.name;
        const fileExtension: string = originalName.split('.').pop() as string;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const result = reader.result as string;
            const imageBase64Data = result.split(',')[1]; // Extract base64 data

            const imageData: ImageDataPayload = {
                image: imageBase64Data,
                fileExt: fileExtension,
            };

            try {
                const resultOfUpload = await uploadImage({
                    imageData,
                    adminKey: getAdminKey(),
                }).unwrap();

                if (resultOfUpload.errorMessage) {
                    throw new Error(resultOfUpload.errorMessage);
                }

                if ((resultOfUpload.data as string).includes(fileExtension)) {
                    setUnsupportedFileError(false);
                    console.log('File uploaded successfully');
                    const uuidName = resultOfUpload.data as string;

                    setParentForm((prev) => ({
                        ...prev,
                        [imageKey]: {
                            originalName,
                            uuidName,
                        },
                    }));
                } else {
                    throw new Error('upload failed');
                }
            } catch (error) {
                console.error('uploadFile caught error:', error);
            }
        };
    };

    const currentImage = parentForm[imageKey] as ImageSource;

    return (
        <div>
            <label>Image (optional?):</label>
            {currentImage.uuidName ? (
                <UploadedImage
                    imageKey={imageKey}
                    imageSource={currentImage}
                    setParentForm={setParentForm}
                />
            ) : (
                <input
                    type='file'
                    id='hide-upload-default-text'
                    onChange={handleFileChange}
                    disabled={isLoading}
                />
            )}
            {isError && (
                <div>
                    Something went wrong while uploading the image. Please try
                    again.
                </div>
            )}
            {unsupportedFileError && (
                <div>
                    Unsupported file type or file size exceeds {MAX_FILE_SIZE}
                    MB. Please upload a valid image.
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
