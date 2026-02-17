import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useGetMenuitemsQuery, usePostMenuitemMutation } from './menuitemsApiSlice';

interface AddMenuitemProps {
    setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddMenuitem = ({ setShowSuccess }: AddMenuitemProps) => {
    const navigate = useNavigate();

    const [newMenuitem, setNewMenuitem] = useState({
        content: '',
    });

    const [postRecipe, { isLoading: isPostLoading, isError }] =
        usePostMenuitemMutation();
    const { refetch, isFetching: isGetFetching } = useGetMenuitemsQuery();

    const isLoading = isPostLoading || isGetFetching;
    const submitDisabled = isLoading || !newMenuitem.content;
    const cancelDisabled = isLoading;

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMenuitem({ ...newMenuitem, content: e.target.value });
    };

    const handleCancel = () => {
        void navigate('/');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Adding new Menuitem:', newMenuitem);

        try {
            const postResult = await postRecipe(newMenuitem).unwrap();

            if (postResult.errorMessage) {
                throw new Error(postResult.errorMessage);
            }

            await refetch();
            setShowSuccess(true);
            navigate('/');
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
                        onChange={handleOnChange}
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
