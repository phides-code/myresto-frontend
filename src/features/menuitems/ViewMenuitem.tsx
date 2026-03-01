import { useParams } from 'react-router';
import {
    useGetMenuitemByIdQuery,
    useGetMenuitemsQuery,
    usePutMenuitemMutation,
} from './menuitemsApiSlice';
import { useContext, useEffect, useState } from 'react';
import { AdminKeyValidityContext } from '../../context/AdminKeyValidityContext';
import { useAdminKey } from '../../context/AdminKeyContext';
import { URL_PREFIX } from '../../constants';
import type { ImageSource, NewOrUpdatedMenuitem } from '../../types';
import ImageUploader from '../images/ImageUploader';

const ViewMenuitem = () => {
    const { menuitemId } = useParams<{ menuitemId: string }>();
    const { adminKeyValid } = useContext(AdminKeyValidityContext);

    const { getAdminKey } = useAdminKey();

    const [editMode, setEditMode] = useState(false);
    const [updatedMenuitem, setUpdatedMenuitem] =
        useState<NewOrUpdatedMenuitem>({
            content: '',
            imageSource: {
                originalName: '',
                uuidName: '',
            } as ImageSource,
        });

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

    const menuitem = data?.data;

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedMenuitem((menuitem) => ({
            ...menuitem,
            content: e.target.value,
        }));
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
        console.log('Updating Menuitem:', updatedMenuitem);

        const adminKey = getAdminKey();

        try {
            const putResult = await putMenuitem({
                menuitem: { id: menuitemId, ...updatedMenuitem },
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

    useEffect(() => {
        if (menuitem) {
            setUpdatedMenuitem(menuitem);
        }
    }, [menuitem]);

    if (isQueryLoading) {
        return <div>Loading...</div>;
    }
    if (isQueryError) {
        return <div>Error loading menuitem.</div>;
    }

    if (!menuitem) {
        return <div>Menuitem not found.</div>;
    }

    const contentUnchanged = menuitem.content === updatedMenuitem.content;
    const isLoading = isPutLoading || isQueryFetching || isGetFetching;
    const submitDisabled = isLoading || contentUnchanged || !adminKeyValid;

    const MenuitemImg = () => (
        <img
            src={`${URL_PREFIX}/assets/${menuitem.imageSource.uuidName}`}
            alt={menuitem.imageSource.originalName}
            style={{
                width: '100px',
            }}
        />
    );

    return (
        <div>
            <h1>Menuitem Details</h1>
            <p>ID: {menuitem.id}</p>
            <p>Created At: {new Date(menuitem.createdOn).toLocaleString()}</p>

            {editMode ? (
                <div>
                    <form onSubmit={handleSubmit}>
                        <fieldset disabled={isLoading}>
                            <p>
                                <ImageUploader
                                    parentForm={updatedMenuitem}
                                    setParentForm={setUpdatedMenuitem}
                                />
                            </p>
                            <label htmlFor='menuitemContent'>Content:</label>
                            <input
                                type='text'
                                id='menuitemContent'
                                name='menuitemContent'
                                defaultValue={menuitem.content}
                                required
                                onChange={handleOnChange}
                            />
                            <p>
                                <button type='submit' disabled={submitDisabled}>
                                    Update Menuitem
                                </button>

                                <button type='button' onClick={handleCancel}>
                                    Cancel
                                </button>
                            </p>
                            {isPutError && (
                                <p>
                                    Error updating menuitem. Please try again.
                                </p>
                            )}
                        </fieldset>
                    </form>
                </div>
            ) : (
                <div>
                    <p>
                        <MenuitemImg />
                    </p>
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
