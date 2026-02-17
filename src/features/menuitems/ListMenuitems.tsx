import MenuitemListItem from './MenuitemListItem';
import { useGetMenuitemsQuery } from './menuitemsApiSlice';

const ListMenuitems = () => {
    const { data, isError, isLoading } = useGetMenuitemsQuery();

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error loading menuitems.</div>;
    }

    const menuitems = data?.data ?? [];
    if (menuitems.length === 0) {
        return <div>No menuitems found.</div>;
    }

    return (
        <div>
            <h1>Menuitems List</h1>
            <ul>
                {menuitems.map((menuitem) => (
                    <MenuitemListItem key={menuitem.id} menuitem={menuitem} />
                ))}
            </ul>
        </div>
    );
};

export default ListMenuitems;
