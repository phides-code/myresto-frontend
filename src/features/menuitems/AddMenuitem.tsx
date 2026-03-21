import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import {
    useGetMenuitemsQuery,
    usePostMenuitemMutation,
} from './menuitemsApiSlice';
import { AdminKeyValidityContext } from '../../context/AdminKeyValidityContext';
import { useAdminKey } from '../../context/AdminKeyContext';
import ImageUploader from '../images/ImageUploader';
import type { ImageSource, NewOrUpdatedMenuitem } from '../../types';

interface AddMenuitemProps {
    setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddMenuitem = ({ setShowSuccess }: AddMenuitemProps) => {
    const navigate = useNavigate();

    const { getAdminKey } = useAdminKey();

    const { adminKeyValid } = useContext(AdminKeyValidityContext);

    const [newMenuitem, setNewMenuitem] = useState<NewOrUpdatedMenuitem>({
        title: '',
        imageSource: {
            originalName: '',
            uuidName: '',
        } as ImageSource,
        description: '',
        price: '',
        category: '',
    });

    const [postMenuitem, { isLoading: isPostLoading, isError }] =
        usePostMenuitemMutation();
    const { refetch, isFetching: isGetFetching } = useGetMenuitemsQuery();

    const isLoading = isPostLoading || isGetFetching;
    const submitDisabled =
        isLoading ||
        !newMenuitem.title ||
        !newMenuitem.description ||
        !newMenuitem.price ||
        !newMenuitem.category ||
        !adminKeyValid;
    const cancelDisabled = isLoading;

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        field: keyof NewOrUpdatedMenuitem,
    ) => {
        setNewMenuitem({ ...newMenuitem, [field]: event.target.value });
    };

    const handleCancel = () => {
        void navigate('/');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const adminKey = getAdminKey();

        try {
            const postResult = await postMenuitem({
                menuitem: newMenuitem,
                adminKey,
            }).unwrap();

            if (postResult.errorMessage) {
                throw new Error(postResult.errorMessage);
            }

            await refetch();
            setShowSuccess(true);

            navigate(`/menuitems/${postResult.data?.id}`);
        } catch (error) {
            console.error('Error adding menuitem:', error);
        }
    };

    return (
        <div>
            <h1>Add Menuitem</h1>
            <form onSubmit={handleSubmit}>
                <fieldset disabled={isLoading || !adminKeyValid}>
                    <p>
                        <label htmlFor='menuitemTitle'>Menuitem Title:</label>
                        <input
                            type='text'
                            id='menuitemTitle'
                            name='menuitemTitle'
                            required
                            placeholder='Enter title'
                            autoFocus
                            onChange={(e) => {
                                handleInputChange(e, 'title');
                            }}
                            value={newMenuitem.title}
                        />
                    </p>
                    <p>
                        <label htmlFor='menuitemDescription'>
                            Description:
                        </label>
                        <input
                            type='text'
                            id='menuitemDescription'
                            name='menuitemDescription'
                            required
                            placeholder='Enter description'
                            autoFocus
                            onChange={(e) => {
                                handleInputChange(e, 'description');
                            }}
                            value={newMenuitem.description}
                        />
                    </p>
                    <p>
                        <label htmlFor='menuitemPrice'>Price:</label>
                        <input
                            type='text'
                            id='menuitemPrice'
                            name='menuitemPrice'
                            required
                            placeholder='Enter price'
                            autoFocus
                            onChange={(e) => {
                                handleInputChange(e, 'price');
                            }}
                            value={newMenuitem.price}
                        />
                    </p>

                    <p>
                        <label htmlFor='menuitemCategory'>Category:</label>
                        <input
                            type='text'
                            id='menuitemCategory'
                            name='menuitemCategory'
                            required
                            placeholder='Enter category'
                            autoFocus
                            onChange={(e) => {
                                handleInputChange(e, 'category');
                            }}
                            value={newMenuitem.category}
                        />
                    </p>

                    <p>
                        <ImageUploader
                            parentForm={newMenuitem}
                            setParentForm={setNewMenuitem}
                            imageKey='imageSource'
                        />
                    </p>

                    <p>
                        <button type='submit' disabled={submitDisabled}>
                            Add Menuitem
                        </button>

                        <button
                            type='button'
                            disabled={cancelDisabled}
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </p>
                    {isError && <p>Error adding menuitem. Please try again.</p>}
                </fieldset>
            </form>
        </div>
    );
};

export default AddMenuitem;
