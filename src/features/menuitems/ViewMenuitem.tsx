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
            title: '',
            imageSource: {
                originalName: '',
                uuidName: '',
            } as ImageSource,
            description: '',
            price: '',
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

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        field: keyof NewOrUpdatedMenuitem,
    ) => {
        setUpdatedMenuitem((menuitem) => ({
            ...menuitem,
            [field]: event.target.value,
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

    const contentUnchanged =
        menuitem.title === updatedMenuitem.title &&
        menuitem.description === updatedMenuitem.description &&
        menuitem.price === updatedMenuitem.price &&
        menuitem.imageSource.uuidName === updatedMenuitem.imageSource.uuidName;

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
                            <p>
                                <label htmlFor='menuitemTitle'>Title:</label>
                                <input
                                    type='text'
                                    id='menuitemTitle'
                                    name='menuitemTitle'
                                    defaultValue={menuitem.title}
                                    required
                                    onChange={(e) => {
                                        handleInputChange(e, 'title');
                                    }}
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
                                    defaultValue={menuitem.description}
                                    required
                                    onChange={(e) => {
                                        handleInputChange(e, 'description');
                                    }}
                                />
                            </p>

                            <p>
                                <label htmlFor='menuitemPrice'>Price:</label>
                                <input
                                    type='text'
                                    id='menuitemPrice'
                                    name='menuitemPrice'
                                    defaultValue={menuitem.price}
                                    required
                                    onChange={(e) => {
                                        handleInputChange(e, 'price');
                                    }}
                                />
                            </p>
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
                    <p>Title: {menuitem.title}</p>
                    <p>Description: {menuitem.description}</p>
                    <p>Price: {menuitem.price}</p>
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
