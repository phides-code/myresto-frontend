import { useContext } from 'react';
import { URL_PREFIX } from '../../constants';
import { useAdminKey } from '../../context/AdminKeyContext';
import type { ImageSource } from '../../types';
import { useDeleteImageMutation } from './imagesApiSlice';
import { AdminKeyValidityContext } from '../../context/AdminKeyValidityContext';

export interface UploadedImageProps<
    T extends { imageSource: ImageSource | null },
> {
    imageSource: ImageSource;
    setParentForm: React.Dispatch<React.SetStateAction<T>>;
}

const UploadedImage = <T extends { imageSource: ImageSource | null }>({
    imageSource,
    setParentForm: setMenuitem,
}: UploadedImageProps<T>) => {
    const [deleteImage, { isError, isLoading }] = useDeleteImageMutation();

    const { getAdminKey } = useAdminKey();
    const { adminKeyValid } = useContext(AdminKeyValidityContext);

    const inputDisabled = isLoading || !adminKeyValid;

    const removeFileFromList = async (
        ev: React.MouseEvent<HTMLButtonElement>,
        fileToRemove: ImageSource,
    ) => {
        ev.preventDefault();

        try {
            const resultOfDelete = await deleteImage({
                id: fileToRemove.uuidName,
                adminKey: getAdminKey(),
            }).unwrap();

            if (resultOfDelete.errorMessage) {
                throw new Error(resultOfDelete.errorMessage);
            }

            if (
                (resultOfDelete.data as string).includes(fileToRemove.uuidName)
            ) {
                console.log('File removed successfully');

                setMenuitem((menuItem) => ({
                    ...menuItem,
                    imageSource: {
                        originalName: '',
                        uuidName: '',
                    },
                }));
            } else {
                throw new Error('delete failed');
            }
        } catch (error) {
            console.error('removeFileFromList caught error: ', error);
        }
    };

    return (
        <div>
            <img
                src={`${URL_PREFIX}/assets/${imageSource.uuidName}`}
                alt={imageSource.originalName}
                style={{
                    width: '100px',
                }}
            />
            <div>
                <span>{imageSource.originalName}</span>
                <button
                    disabled={inputDisabled}
                    onClick={(ev) => {
                        removeFileFromList(ev, imageSource);
                    }}
                >
                    remove
                </button>
            </div>
            {isError && (
                <p>
                    Something went wrong while removing the image. Please try
                    again.
                </p>
            )}
        </div>
    );
};

export default UploadedImage;
