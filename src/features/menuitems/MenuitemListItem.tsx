import { Link } from 'react-router';
import {
    useDeleteMenuitemMutation,
    useGetMenuitemsQuery,
} from './menuitemsApiSlice';
import { useContext, useState } from 'react';
import type { Menuitem } from '../../types';
import { AdminKeyValidityContext } from '../../context/AdminKeyValidityContext';
import { useAdminKey } from '../../context/AdminKeyContext';
import { URL_PREFIX } from '../../constants';
import { useDeleteImageMutation } from '../images/imagesApiSlice';

const MenuitemListItem = ({ menuitem }: { menuitem: Menuitem }) => {
    const { getAdminKey } = useAdminKey();
    const { adminKeyValid } = useContext(AdminKeyValidityContext);

    const [
        deleteMenuitem,
        { isLoading: isMenuitemLoading, isError: isMenuitemError },
    ] = useDeleteMenuitemMutation();

    const [deleteImage, { isError: isImageError, isLoading: isImageLoading }] =
        useDeleteImageMutation();

    const { refetch, isFetching } = useGetMenuitemsQuery();

    const [deletingThis, setDeletingThis] = useState(false);

    const handleDelete = async () => {
        console.log(`Deleting menuitem with id: ${menuitem.id}`);

        const adminKey = getAdminKey();

        try {
            setDeletingThis(true);

            const [menuitemResult, imageResult] = await Promise.all([
                deleteMenuitem({ id: menuitem.id, adminKey }).unwrap(),
                deleteImage({
                    id: menuitem.imageSource.uuidName,
                    adminKey,
                }).unwrap(),
            ]);

            if (menuitemResult.errorMessage) {
                throw new Error(menuitemResult.errorMessage);
            }
            if (imageResult.errorMessage) {
                throw new Error(imageResult.errorMessage);
            }

            await refetch();
        } catch (error) {
            console.error('Error deleting menuitem:', error);
        }
    };

    const disableDeleteButton =
        ((isFetching || isMenuitemLoading || isImageLoading) && deletingThis) ||
        !adminKeyValid;

    return (
        <li>
            <Link to={`/menuitems/${menuitem.id}`}>
                {menuitem.content}
                <img
                    src={`${URL_PREFIX}/assets/${menuitem.imageSource.uuidName}`}
                    alt={menuitem.imageSource.originalName}
                    style={{
                        width: '100px',
                    }}
                />
            </Link>
            <button disabled={disableDeleteButton} onClick={handleDelete}>
                Delete
            </button>
            {(isMenuitemError || isImageError) && (
                <span>Error deleting menuitem.</span>
            )}
        </li>
    );
};

export default MenuitemListItem;
