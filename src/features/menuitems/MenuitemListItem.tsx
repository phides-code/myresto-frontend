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

const MenuitemListItem = ({ menuitem }: { menuitem: Menuitem }) => {
    const { getAdminKey } = useAdminKey();
    const { adminKeyValid } = useContext(AdminKeyValidityContext);

    const [
        deleteMenuitem,
        { isLoading: isMenuitemLoading, isError: isMenuitemError },
    ] = useDeleteMenuitemMutation();

    const { refetch, isFetching } = useGetMenuitemsQuery();

    const [deletingThis, setDeletingThis] = useState(false);

    const handleDelete = async () => {
        console.log(`Deleting menuitem with id: ${menuitem.id}`);

        const adminKey = getAdminKey();

        try {
            setDeletingThis(true);

            if (menuitem.imageSource.uuidName === '') {
                const menuitemResult = await deleteMenuitem({
                    id: menuitem.id,
                    adminKey,
                }).unwrap();

                if (menuitemResult.errorMessage) {
                    throw new Error(menuitemResult.errorMessage);
                }
            } else {
                const menuitemResult = await deleteMenuitem({
                    id: menuitem.id,
                    adminKey,
                }).unwrap();

                if (menuitemResult.errorMessage) {
                    throw new Error(menuitemResult.errorMessage);
                }
            }

            await refetch();
        } catch (error) {
            console.error('Error deleting menuitem:', error);
        }
    };

    const disableDeleteButton =
        ((isFetching || isMenuitemLoading) && deletingThis) || !adminKeyValid;

    return (
        <li>
            <Link to={`/menuitems/${menuitem.id}`}>
                {menuitem.title}
                <img
                    src={`${URL_PREFIX}/assets/${menuitem.imageSource.uuidName}`}
                    alt={menuitem.imageSource.originalName}
                    style={{
                        width: '100px',
                    }}
                />
            </Link>
            <div>{menuitem.description}</div>
            <div>{menuitem.price}</div>
            <div>{menuitem.category}</div>
            <button disabled={disableDeleteButton} onClick={handleDelete}>
                Delete
            </button>
            {isMenuitemError && <span>Error deleting menuitem.</span>}
        </li>
    );
};

export default MenuitemListItem;
