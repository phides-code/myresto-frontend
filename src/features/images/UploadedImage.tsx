import { URL_PREFIX } from '../../constants';
import type { ImageSource } from '../../types';

export interface UploadedImageProps<T, K extends keyof T> {
    imageKey: K;
    imageSource: ImageSource;
    setParentForm: React.Dispatch<React.SetStateAction<T>>;
}

/** Only use with a key K where T[K] is {@link ImageSource} (see {@link ImageUploader}). */
const UploadedImage = <T, K extends keyof T>({
    imageKey,
    imageSource,
    setParentForm,
}: UploadedImageProps<T, K>) => {
    const handleRemove = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault();

        setParentForm((prev) => ({
            ...prev,
            [imageKey]: {
                originalName: '',
                uuidName: '',
            },
        }));
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
                <button onClick={handleRemove}>remove</button>
            </div>
        </div>
    );
};

export default UploadedImage;
