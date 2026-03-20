import { Link } from 'react-router';

const MainNav = () => {
    return (
        <div>
            <div>
                <Link to='/'>Home</Link>
            </div>
            <div>
                <Link to='/menuitems'>Menuitems</Link>
            </div>
            <div>
                <Link to='/settings'>Settings</Link>
            </div>
        </div>
    );
};

export default MainNav;
