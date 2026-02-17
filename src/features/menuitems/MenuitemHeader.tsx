import { Link } from 'react-router';

const MenuitemHeader = () => {
    return (
        <div>
            <div>
                <Link to='/'>Menuitems</Link>
            </div>
            <div>
                <Link to='/add-menuitem'>Add Menuitem</Link>
            </div>
        </div>
    );
};
export default MenuitemHeader;
