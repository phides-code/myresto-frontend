import { useParams } from 'react-router';
import {
    useGetMenuitemByIdQuery,
    useGetMenuitemsQuery,
    usePutMenuitemMutation,
} from './menuitemsApiSlice';
import { useContext, useState } from 'react';
import { AdminKeyValidityContext } from '../../context/AdminKeyValidityContext';
import { useAdminKey } from '../../context/AdminKeyContext';

const ViewMenuitem = () => {
    const { menuitemId } = useParams<{ menuitemId: string }>();
    const { adminKeyValid } = useContext(AdminKeyValidityContext);

    const { getAdminKey } = useAdminKey();

    const [editMode, setEditMode] = useState(false);
    const [updatedContent, setUpdatedContent] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const {
        data,
        isError: isQueryError,
        isLoading: isQueryLoading,
        isFetching: isQueryFetching,
        refetch: refetchQuery,
    } = useGetMenuitemByIdQuery(menuitemId as string);
    const [putMenuitem, { isLoading: isPutLoading, isError: isPutError }] =
        usePutMenuitemMutation();
    const { isFetching: isGetFetching, refetch: refetchGet } =
        useGetMenuitemsQuery();

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedContent(e.target.value);
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancel = () => {
        setEditMode(false);
    };

    const refetchQueryAndGet = async () => {
        await refetchQuery();
        await refetchGet();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Updating Menuitem:', updatedContent);

        const adminKey = getAdminKey();

        try {
            const putResult = await putMenuitem({
                menuitem: { id: menuitemId, content: updatedContent },
                adminKey,
            }).unwrap();

            if (putResult.errorMessage) {
                throw new Error(putResult.errorMessage);
            }

            await refetchQueryAndGet();
            setShowSuccess(true);
            setEditMode(false);
        } catch (error) {
            console.error('Error adding menuitem:', error);
        }
    };

    if (isQueryLoading) {
        return <div>Loading...</div>;
    }
    if (isQueryError) {
        return <div>Error loading menuitem.</div>;
    }
    const menuitem = data?.data;
    if (!menuitem) {
        return <div>Menuitem not found.</div>;
    }

    const contentUnchanged = menuitem.content === updatedContent;
    const isLoading = isPutLoading || isQueryFetching || isGetFetching;
    const submitDisabled =
        isLoading || contentUnchanged || !updatedContent || !adminKeyValid;
    const cancelDisabled = isLoading;

    return (
        <div>
            <h1>Menuitem Details</h1>
            <p>ID: {menuitem.id}</p>
            <p>Created At: {new Date(menuitem.createdOn).toLocaleString()}</p>

            {editMode ? (
                <div>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor='menuitemContent'>Content:</label>
                        <input
                            type='text'
                            id='menuitemContent'
                            name='menuitemContent'
                            defaultValue={menuitem.content}
                            required
                            onChange={handleOnChange}
                            disabled={isLoading}
                        />
                        <button type='submit' disabled={submitDisabled}>
                            Update Menuitem
                        </button>
                        <button
                            type='button'
                            disabled={cancelDisabled}
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        {isPutError && (
                            <p>Error updating menuitem. Please try again.</p>
                        )}
                    </form>
                </div>
            ) : (
                <div>
                    <p>Content: {menuitem.content}</p>
                    <button onClick={handleEdit}>Edit</button>
                </div>
            )}
            {showSuccess && (
                <div>
                    <h2>Menuitem updated successfully!</h2>
                    <button
                        onClick={() => {
                            setShowSuccess(false);
                        }}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default ViewMenuitem;
