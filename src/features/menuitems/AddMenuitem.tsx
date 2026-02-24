import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import {
    useGetMenuitemsQuery,
    usePostMenuitemMutation,
} from './menuitemsApiSlice';
import { AdminKeyValidityContext } from '../../context/AdminKeyValidityContext';
import { useAdminKey } from '../../context/AdminKeyContext';

interface AddMenuitemProps {
    setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddMenuitem = ({ setShowSuccess }: AddMenuitemProps) => {
    const navigate = useNavigate();

    const { getAdminKey } = useAdminKey();

    const { adminKeyValid } = useContext(AdminKeyValidityContext);

    const [newMenuitem, setNewMenuitem] = useState({
        content: '',
    });

    const [postMenuitem, { isLoading: isPostLoading, isError }] =
        usePostMenuitemMutation();
    const { refetch, isFetching: isGetFetching } = useGetMenuitemsQuery();

    const isLoading = isPostLoading || isGetFetching;
    const submitDisabled = isLoading || !newMenuitem.content || !adminKeyValid;
    const cancelDisabled = isLoading;

    const handleMenuItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMenuitem({ ...newMenuitem, content: e.target.value });
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
            <p>Menuitems are a great source of potassium!</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='menuitemContent'>Menuitem Content:</label>
                    <input
                        type='text'
                        id='menuitemContent'
                        name='menuitemContent'
                        required
                        placeholder='Enter menuitem content'
                        autoFocus
                        onChange={handleMenuItemChange}
                        value={newMenuitem.content}
                        disabled={isLoading}
                    />
                </div>

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
                {isError && <p>Error adding menuitem. Please try again.</p>}
            </form>
        </div>
    );
};

export default AddMenuitem;
