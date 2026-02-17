import { Link } from 'react-router';
import { useDeleteMenuitemMutation, useGetMenuitemsQuery } from './menuitemsApiSlice';
import { useState } from 'react';
import type { Menuitem } from '../../types';

const MenuitemListItem = ({ menuitem }: { menuitem: Menuitem }) => {
    const [deleteMenuitem, { isLoading, isError }] = useDeleteMenuitemMutation();
    const { refetch, isFetching } = useGetMenuitemsQuery();

    const [deletingThis, setDeletingThis] = useState(false);

    const handleDelete = async () => {
        console.log(`Deleting menuitem with id: ${menuitem.id}`);

        try {
            setDeletingThis(true);
            const deleteResult = await deleteMenuitem(menuitem.id).unwrap();

            if (deleteResult.errorMessage) {
                throw new Error(deleteResult.errorMessage);
            }

            await refetch();
        } catch (error) {
            console.error('Error deleting menuitem:', error);
        }
    };

    const disableDeleteButton = (isFetching || isLoading) && deletingThis;

    return (
        <li>
            <Link to={`/${menuitem.id}`}> {menuitem.content}</Link>
            <button disabled={disableDeleteButton} onClick={handleDelete}>
                Delete
            </button>
            {isError && <span>Error deleting menuitem.</span>}
        </li>
    );
};

export default MenuitemListItem;
