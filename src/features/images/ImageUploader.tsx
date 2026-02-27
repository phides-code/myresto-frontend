import { useContext, useState } from 'react';
import { useUploadImageMutation } from './imagesApiSlice';
import type { ImageDataPayload, ImageSource } from '../../types';
import { useAdminKey } from '../../context/AdminKeyContext';
import UploadedImage from './UploadedImage';
import { AdminKeyValidityContext } from '../../context/AdminKeyValidityContext';

interface ImageUploaderProps<T> {
    parentForm: T;
    setParentForm: React.Dispatch<React.SetStateAction<T>>;
}

const MAX_FILE_SIZE = 5; // 5MB

const ImageUploader = <T extends { imageSource: ImageSource | null }>({
    parentForm: menuitem,
    setParentForm: setMenuitem,
}: ImageUploaderProps<T>) => {
    const [uploadImage, { isError, isLoading }] = useUploadImageMutation();
    const [unsupportedFileError, setUnsupportedFileError] =
        useState<boolean>(false);

    const { getAdminKey } = useAdminKey();

    const { adminKeyValid } = useContext(AdminKeyValidityContext);

    const inputDisabled = isLoading || !adminKeyValid;

    const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList = ev.target.files as FileList;
        const file: File = files[0];

        if (
            // !file ||
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

                    setMenuitem((menuitem) => ({
                        ...menuitem,
                        imageSource: {
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

    return (
        <div>
            <label>Image (optional?):</label>
            {menuitem.imageSource?.uuidName ? (
                <UploadedImage
                    imageSource={menuitem.imageSource}
                    setParentForm={setMenuitem}
                />
            ) : (
                <input
                    disabled={inputDisabled}
                    type='file'
                    id='hide-upload-default-text'
                    onChange={handleFileChange}
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
